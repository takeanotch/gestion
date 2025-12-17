import ProductManager from '@/components/ProductManager';
// import CategoryManager from '@/components/CategoryManager';

export default function ProductsPage() {
  return (
    <div className="container mx-auto px- py-">
      <ProductManager />
      
      {/* <div className="mt-">
        <h2 className="text-2xl font-bold mb-6">Gestion des catégories</h2>
         <CategoryManager /> 
      </div> */}
    </div>
  );
}