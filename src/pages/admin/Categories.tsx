import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../api/endpoints';
import type { Category } from '../../types';
import { apiErrorMessage } from '../../api/client';
import { dangerLink, primaryButton } from '../../styles';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetchCategories().then(setCategories).catch(() => undefined);
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createCategory(newName);
      setNewName('');
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not create category.'));
    }
  }

  async function handleUpdate(id: number) {
    setError(null);
    try {
      await updateCategory(id, editingName);
      setEditingId(null);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not update category.'));
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, 'Could not delete category.'));
    }
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-lg font-semibold text-stone-900">Categories</h2>

      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          required
          className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
        />
        <button type="submit" className={primaryButton}>
          Add
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="divide-y divide-stone-200 rounded-md border border-stone-200 bg-white px-4 shadow-sm">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-3">
            {editingId === c.id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 rounded-md border border-stone-300 px-2 py-1 text-sm text-stone-800 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            ) : (
              <span className="text-sm text-stone-700">{c.name}</span>
            )}
            <div className="flex gap-3 text-xs">
              {editingId === c.id ? (
                <button onClick={() => handleUpdate(c.id)} className="text-stone-800 hover:underline">
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(c.id);
                    setEditingName(c.name);
                  }}
                  className="text-stone-500 hover:text-stone-900 hover:underline"
                >
                  Edit
                </button>
              )}
              <button onClick={() => handleDelete(c.id)} className={dangerLink}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
