import React,{useState} from 'react';
import './App.css'
import axios from 'axios';

interface Product {
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
}


  const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  name: {
    margin: "0 0 8px",
    fontSize: "1.2rem",
    color: "#333",
  },
  category: {
    margin: "0 0 4px",
    fontWeight: "bold",
    color: "#666",
  },
  price: {
    margin: "0 0 8px",
    color: "#007BFF",
    fontWeight: "600",
  },
  description: {
    flexGrow: 1,
    marginBottom: "8px",
    color: "#444",
  },
  rating: {
    fontWeight: "bold",
    color: "#FFA500",
  },
};



  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    
    <div style={styles.card}>
      <h2 style={styles.name}>{product.name}</h2>
      <p style={styles.category}>Category: {product.category}</p>
      <p style={styles.price}>${product.price.toFixed(2)}</p>
      <p style={styles.description}>{product.description}</p>
      <p style={styles.rating}>Rating: {product.rating} ⭐</p>
    </div>
  );
};

  const storeproducts: Product[] = [
  {
    name: "Wireless Headphones",
    price: 99.99,
    category: "Electronics",
    description: "Noise-cancelling over-ear headphones with long battery life.",
    rating: 4.5,
  },
  {
    name: "Organic Green Tea",
    price: 15.5,
    category: "Groceries",
    description: "Premium organic green tea leaves sourced from Japan.",
    rating: 4.8,
  },
  {
    name: "Yoga Mat",
    price: 25.0,
    category: "Fitness",
    description: "Eco-friendly, non-slip yoga mat for all types of workouts.",
    rating: 4.2,
  },
  {
    name: "Smart Watch",
    price: 199.99,
    category: "Electronics",
    description: "Water-resistant smartwatch with heart rate monitor and GPS.",
    rating: 4.3,
  },
  {
    name: "LED Desk Lamp",
    price: 45.0,
    category: "Home & Office",
    description: "Adjustable brightness LED lamp with USB charging port.",
    rating: 4.0,
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 22.99,
    category: "Outdoors",
    description: "Insulated bottle keeps drinks cold or hot for 12 hours.",
    rating: 4.6,
  },
  {
    name: "Bluetooth Speaker",
    price: 59.99,
    category: "Electronics",
    description: "Portable speaker with high-quality sound and deep bass.",
    rating: 4.4,
  },
  {
    name: "Running Shoes",
    price: 120.0,
    category: "Fitness",
    description: "Lightweight and durable shoes designed for runners.",
    rating:4.3,}
  ]


const ProductList: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [AIsearch,setAIsearch] = useState("");
  const [AIresponse,setAIresponse] = useState(['']);
  
  const filteredProducts = storeproducts.filter((prod)=>{
    if(searchTerm==="" && AIresponse[0]==="y'w"){
      return prod
    }
    else if(searchTerm!==""){
       if(prod.category.toLowerCase().includes(searchTerm.toLowerCase()) || prod.price.toString().includes(searchTerm)){
         return prod
        }
    }
    else {
      const response = AIresponse.some(word=>{
        if(prod.name.toLowerCase().includes(word.toLowerCase())){
          return prod
        }
      }
      )
      return response
        
      }
    }
    
  
  )
  

    const handleSearchChange=()=>(e:React.ChangeEvent<HTMLInputElement>)=>{
      setAIresponse(['']);
      setAIsearch("");
      const search = e.target.value;
      setSearchTerm(search);
    }

    const handleAIsearchChange=()=>(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
      setSearchTerm("");
      const search = e.target.value
        setAIsearch(search);
    }

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{

     e.preventDefault();

     try{
      await axios.post(`${import.meta.env.VITE_APP_OPENAI}/api/productsearches`,{"productsearch":AIsearch}).then(res=>{
        console.log(res.data);
        const items = JSON.parse(res.data);
        setAIresponse(items.message);
      })
    }
    catch(error){
       if (axios.isAxiosError(error)) {
       console.error("Axios error:", error.response?.data || error.message);
        } else {
        console.error("Unexpected error:", error);
       }
    }

    }
  

  console.log(filteredProducts,"bro this is what I filtered");
  return (

    <>
   <input
  type="search"
  id="search"
  name="search"
  placeholder="Search Category or Price..."
  value={searchTerm}
  onChange={handleSearchChange()}
  aria-label="Search products"
      style={{
        padding: "8px 12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "250px",
        marginBottom:10
      }}
/>
    <div style={styles.container}>
       <div className="sidebar-container">
      <h2>Search with AI</h2>
      <form onSubmit={handleSubmit} >
        <textarea
          value={AIsearch}
          onChange={handleAIsearchChange()}
          placeholder="Enter your text..."
        />
        <button type="submit">Find</button>
      </form>
    </div>
      
      {filteredProducts.map((prod, index) => (
        <ProductCard key={index} product={prod} />
      ))}
      
    </div>
  </>
  
  );
};



export default ProductList
