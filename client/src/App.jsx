
function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ margin: 0, fontSize: '1.9rem' }}>GDG Blog App</h1>
      <p style={{ maxWidth: 600, lineHeight: 1.5 }}>
        Frontend scaffolding in progress. Tailwind, routing, and pages will be added next.
      </p>
      <ul style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.6 }}>
        <li>Home: blog list</li>
        <li>Blog detail: /blog/:slug</li>
        <li>Create: protected form</li>
        <li>Auth: login / signup</li>
      </ul>
    </div>
  );
}

export default App;
