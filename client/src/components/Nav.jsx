const Nav = () => {
  return (
    <nav className='flex w-full justify-between p-4'>
        <h1
          className="text-xl font-semibold"
        >
          Music-dev
        </h1>

        <span className="absolute left-1/2 -translate-x-1/2 flex gap-2">
          <select className="bg-slate-700 px-2 rounded-md cursor-pointer text-blue-400" name="filters" id="filters">
            <option value="0" defaultValue={'0'}>
              Filtros
            </option>
            <option value="1">
              hola1
            </option>
            <option value="2">
              hola2
            </option>
            <option value="3">
              hola3
            </option>
            <option value="4">
              hola4
            </option>
            <option value="5">
              hola5
            </option>
          </select>
          <input type="search" className="p-1 rounded-md w-60" name="search" id="search" placeholder="Mitski..." />
          <span className="absolute right-1 top-1/2 -translate-y-1/2">🔎</span>
        </span>

        <span>
          <button>
            🙍
            <span id="account-name"></span>
          </button>
          <button>
            🛒
            <span id='shopping-cart-counter'></span>
          </button>
        </span>
      </nav>
  );
}

export default Nav;