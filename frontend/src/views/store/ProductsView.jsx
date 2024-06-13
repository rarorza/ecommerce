import { useEffect, useState } from 'react'
import apiInstance from '../../utils/axios'
import { Link } from 'react-router-dom'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

  const [colorValue, setColorValue] = useState('No Color')
  const [sizeValue, setSizeValue] = useState('No Size')
  const [qtyValue, setQtyValue] = useState(1)

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedColors, setSelectedColors] = useState({})
  const [selectedSizes, setSelectedSizes] = useState({})

  useEffect(() => {
    apiInstance.get('products/').then((res) => {
      setProducts(res.data)
    })
  }, [])

  useEffect(() => {
    apiInstance.get('categories/').then((res) => {
      setCategories(res.data)
    })
  }, [])

  const handleColorButtonClick = (e, productId, colorName) => {
    setColorValue(colorName)
    setSelectedProduct(productId)

    setSelectedColors((prevSelectedColors) => ({
      // This function updates the state object selectedColors. It uses the previous
      // state (prevSelectedColors) and returns a new state object where the
      // productId key is set to colorName. The ...prevSelectedColors syntax ensures
      // that the rest of the state object remains unchanged
      ...prevSelectedColors,
      [productId]: colorName,
    }))
  }

  const handleSizeButtonClick = (e, productId, sizeName) => {
    setSizeValue(sizeName)
    setSelectedProduct(productId)

    setSelectedSizes((prevSelectedSizes) => ({
      ...prevSelectedSizes,
      [productId]: sizeName,
    }))
  }

  const handleQtyChange = (e, productId) => {
    setQtyValue(e.target.value)
    setSelectedProduct(productId)
  }

  console.log(selectedProduct)
  console.log(selectedColors)
  console.log(selectedSizes)

  return (
    <>
      <div>
        <main className="mt-5">
          <div className="container">
            <section className="text-center">
              <div className="row">
                {/* product card start*/}
                {products?.map((product, index) => (
                  <div className="col-lg-4 col-md-12 mb-4" key={index}>
                    <div className="card">
                      <div
                        className="bg-image hover-zoom ripple"
                        data-mdb-ripple-color="light"
                      >
                        <Link to={`detail/${product.slug}`}>
                          <img
                            src={product.image}
                            style={{
                              width: '100%',
                              height: '250px',
                              objectFit: 'cover',
                            }}
                            className="w-100"
                          />
                        </Link>
                      </div>
                      <div className="card-body">
                        <Link
                          to={`detail/${product.slug}`}
                          className="text-reset"
                        >
                          <h5 className="card-title mb-3">{product.title}</h5>
                        </Link>
                        <a href="" className="text-reset">
                          <p>{product.category?.title}</p>
                        </a>
                        <div className="d-flex justify-content-center">
                          <h6 className="mb-3">${product.price}</h6>
                          <h6 className="mb-3 text-muted ms-2">
                            <strike>${product.old_price}</strike>
                          </h6>
                        </div>
                        <div className="btn-group">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuClickable"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="false"
                            aria-expanded="false"
                          >
                            Variation
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuClickable"
                          >
                            <div className="d-flex flex-column">
                              <li className="p-1">
                                <b>Quantity</b>:
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                <li>
                                  <input
                                    className="form-control"
                                    type="number"
                                    onChange={(e) =>
                                      handleQtyChange(e, product.id)
                                    }
                                    value={qtyValue}
                                  />
                                </li>
                              </div>
                            </div>
                            {product.size?.length > 0 && (
                              <div className="d-flex flex-column">
                                <li className="p-1">
                                  <b>Size</b>:{' '}
                                  {selectedSizes[product?.id] || 'No Size'}
                                </li>
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                  {product.size?.map((size, index) => (
                                    <li key={index}>
                                      <button
                                        className="btn btn-secondary btn-sm me-2 mb-1"
                                        onClick={(e) =>
                                          handleSizeButtonClick(
                                            e,
                                            product.id,
                                            size.name,
                                          )
                                        }
                                      >
                                        {size.name}
                                      </button>
                                    </li>
                                  ))}
                                </div>
                              </div>
                            )}
                            {product.color?.length > 0 && (
                              <div className="d-flex flex-column mt-3">
                                <li className="p-1">
                                  <b>Color</b>:{' '}
                                  {selectedColors[product?.id] || 'No Size'}
                                </li>
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                  {product.color?.map((color, index) => (
                                    <li key={index}>
                                      <button
                                        className="btn btn-sm me-2 mb-1 p-3"
                                        style={{
                                          backgroundColor: `${color.name}`,
                                        }}
                                        onClick={(e) =>
                                          handleColorButtonClick(
                                            e,
                                            product.id,
                                            color.name,
                                          )
                                        }
                                      />
                                    </li>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="d-flex mt-3 p-1">
                              <button
                                type="button"
                                className="btn btn-primary me-1 mb-1"
                              >
                                <i className="fas fa-shopping-cart" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger px-3 me-1 mb-1 ms-2"
                              >
                                <i className="fas fa-heart" />
                              </button>
                            </div>
                          </ul>
                          <button
                            type="button"
                            className="btn btn-danger px-3 me-1 ms-2"
                          >
                            <i className="fas fa-heart" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* end */}
                <div className="row">
                  {/* category card */}
                  {categories?.map((category, index) => (
                    <div className="col-lg-2" key={index}>
                      <img
                        src={category.image}
                        style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                        alt=""
                      />
                      <h6>{category.title}</h6>
                    </div>
                  ))}
                  {/* end */}
                </div>
              </div>
            </section>
            {/*Section: Wishlist*/}
          </div>
        </main>
        {/*Main layout*/}
        <main>
          <section className="text-center container">
            <div className="row py-lg-5">
              <div className="col-lg-6 col-md-8 mx-auto">
                <h1 className="fw-light">Trending Products</h1>
                <p className="lead text-muted">
                  Something short and leading about the collection below—its
                  contents
                </p>
              </div>
            </div>
          </section>
          <div className="album py-5 bg-light">
            <div className="container">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card shadow-sm">
                    <svg
                      className="bd-placeholder-img card-img-top"
                      width="100%"
                      height={225}
                      xmlns="http://www.w3.org/2000/svg"
                      role="img"
                      aria-label="Placeholder: Thumbnail"
                      preserveAspectRatio="xMidYMid slice"
                      focusable="false"
                    >
                      <title>Placeholder</title>
                      <rect width="100%" height="100%" fill="#55595c" />
                      <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                        Thumbnail
                      </text>
                    </svg>
                    <div className="card-body">
                      <p className="card-text">
                        This is a wider card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                          >
                            Edit
                          </button>
                        </div>
                        <small className="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Products
