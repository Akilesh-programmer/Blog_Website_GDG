import { useParams } from 'react-router-dom';

export default function BlogDetailPage() {
  const { slug } = useParams();
  return (
    <article className="prose-blog">
      <h1>Post: {slug}</h1>
      <p>The full blog content view will be rendered here.</p>
    </article>
  );
}
