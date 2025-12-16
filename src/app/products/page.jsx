import ProductManager from '@/components/ProductManager';
import CategoryManager from '@/components/CategoryManager';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductManager />
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Gestion des catégories</h2>
        <CategoryManager />
      </div>
    </div>
  );
}