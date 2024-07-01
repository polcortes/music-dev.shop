/* eslint-disable react/prop-types */
const Album = ({ id, name, artist, image }, key) => {
  return (
    <article key={ key } className="rounded-xl overflow-hidden">
      <a href={`/album/${id}`} className="w-64 max-w-64 flex flex-col">
        <img src={image} alt="" loading="lazy" className="size-64 object-contain object-center rounded-xl" />
        <section className="flex flex-col w-full pt-3">
          <h3>{ name }</h3>
          <span>{ artist }</span>
        </section>
      </a>
    </article>
  );
}

export default Album;