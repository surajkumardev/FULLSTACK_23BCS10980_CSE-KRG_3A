import React from "react";
function ProductCard({ name, price, description, inStock }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      width: "250px",
      margin: "10px"
    }}>
    <h2>{name}</h2>
      <p><b>Price:</b> ₹{price}</p>
      <p>{description}</p>
      {inStock ? 
      //if
      ( <button style={{
          padding: "8px 16px",
          backgroundColor: "Orange",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}>Buy Now</button>
      ) 
      
      //else
      : (
        <p style={{ color: "red", fontWeight: "bold" }}>Out of Stock</p>
      )}

    </div>
  );
}

// App component rendering 3 products
function App() {
  const products = [
    {
      name: "Pizza",
      price: 299,
      description: "Delicious cheesy pizza with a crispy crust",
      inStock: false
    },
    {
      name: "Burger",
      price: 69,
      description: "Juicy mouth-watering burger with tandoori sauce",
      inStock: false
    },
    {
      name: "Biryani",
      price: 199,
      description: "Aromatic, biryani cooked with spices .",
      inStock: true
    }
  ];

  return (
    <div style={{ display: "flex" }}>
    {/* map() is an array method. */}
    {/* It loops through each element of an array and returns a new array based on what you return in the callback. */}

    
      {products.map((product, index) => (
        <ProductCard
          key={index}
          name={product.name}
          price={product.price}
          description={product.description}
          inStock={product.inStock}
        />
      ))}
    </div>
  );
}

export default App;
