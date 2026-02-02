import React, { useEffect, useState } from "react";

/* ---------------- Types ---------------- */
type ContentStatus = "Published" | "Draft";
type FilterStatus = "All" | ContentStatus;

type Content = {
  id: string;
  title: string;
  author: string;
  body: string;
  status: ContentStatus;
  date: string;
};

/* ---------------- Constants ---------------- */
const STORAGE_KEY = "site_content";

/* ---------------- Component ---------------- */
export const ContentPage: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  /* -------- Form State -------- */
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<ContentStatus>("Draft");

  /* -------- Load from storage -------- */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setContents(JSON.parse(stored));
    }
  }, []);

  /* -------- Save to storage -------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contents));
  }, [contents]);

  /* -------- Reset Form -------- */
  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setBody("");
    setStatus("Draft");
    setEditingId(null);
  };

  /* -------- Add / Edit Content -------- */
  const handleSave = () => {
    if (!title.trim() || !author.trim() || !body.trim()) return;

    if (editingId) {
      setContents((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title, author, body, status }
            : item
        )
      );
    } else {
      const newContent: Content = {
        id: crypto.randomUUID(),
        title,
        author,
        body,
        status,
        date: new Date().toISOString().split("T")[0],
      };

      setContents((prev) => [newContent, ...prev]);
    }

    resetForm();
    setShowModal(false);
  };

  /* -------- Edit Handler -------- */
  const handleEdit = (content: Content) => {
    setTitle(content.title);
    setAuthor(content.author);
    setBody(content.body);
    setStatus(content.status);
    setEditingId(content.id);
    setShowModal(true);
  };

  /* -------- Filtered Data -------- */
  const filtered =
    filter === "All"
      ? contents
      : contents.filter((c) => c.status === filter);

  const filters: FilterStatus[] = ["All", "Published", "Draft"];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-peach-500 text-white rounded hover:bg-peach-600"
        >
          + New Content
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded border text-sm ${
              filter === f
                ? "bg-peach-500 text-white border-peach-500"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-800 text-left">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Author</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="px-4 py-2 font-medium">{item.title}</td>
              <td className="px-4 py-2">{item.author}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2">{item.date}</td>
              <td className="px-4 py-2 text-sm">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Content" : "Add New Content"}
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                placeholder="Content body..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full border px-3 py-2 rounded min-h-[140px]"
              />

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ContentStatus)
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-peach-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
