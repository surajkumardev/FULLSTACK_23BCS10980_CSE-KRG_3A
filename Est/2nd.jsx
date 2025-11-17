
function UserProfile({ username }) {
  return <h3>Welcome, {username}!</h3>;
}
function Icon({ username }) {
  return (
    <div>
      <p> User Icon</p>
      <UserProfile username={username} /> 
    </div>
  );
}
function Header({ username }) {
  return (
    <header>
      <h2>Header Section</h2>
      <Icon username={username} />
    </header>
  );
}
function App() {
  const username = "Suraj";

  return (
    <div>
      <h1>Prop Drilling Example</h1>
      <Header username={username} />
    </div>
  );
}
export default App;


