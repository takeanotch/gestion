'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategory.trim() }]);
    
    if (!error) {
      setNewCategory('');
      loadCategories();
    }
    setLoading(false);
  };

  const deleteCategory = async (id) => {
    if (!confirm("Cette catégorie contient peut-être des produits. Supprimer quand même ?")) {
      return;
    }
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (!error) {
      loadCategories();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nom de la nouvelle catégorie"
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={addCategory}
          disabled={loading || !newCategory.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Ajout...' : 'Ajouter'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="border rounded p-3 flex justify-between items-center hover:bg-gray-50"
          >
            <span>{category.name}</span>
            <button
              onClick={() => deleteCategory(category.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}