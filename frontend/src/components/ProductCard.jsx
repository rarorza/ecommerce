import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

ProductCard.propTypes = {
  product: PropTypes.object,
  handleQtyChange: PropTypes.func,
  handleSizeButtonClick: PropTypes.func,
  handleColorButtonClick: PropTypes.func,
  qtyValue: PropTypes.number,
  selectedSizes: PropTypes.object,
  selectedColors: PropTypes.object,
}

function ProductCard({
  product,
  handleQtyChange,
  handleSizeButtonClick,
  handleColorButtonClick,
  qtyValue,
  selectedSizes,
  selectedColors,
}) {
  return (
    <>
      <div className="col-lg-4 col-md-12 mb-4">
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
            <Link to={`detail/${product.slug}`} className="text-reset">
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
                        onChange={(e) => handleQtyChange(e, product.id)}
                        value={qtyValue}
                      />
                    </li>
                  </div>
                </div>
                {product.size?.length > 0 && (
                  <div className="d-flex flex-column">
                    <li className="p-1">
                      <b>Size</b>: {selectedSizes[product?.id] || 'No Size'}
                    </li>
                    <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                      {product.size?.map((size, index) => (
                        <li key={index}>
                          <button
                            className="btn btn-secondary btn-sm me-2 mb-1"
                            onClick={(e) =>
                              handleSizeButtonClick(e, product.id, size.name)
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
                      <b>Color</b>: {selectedColors[product?.id] || 'No Size'}
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
                              handleColorButtonClick(e, product.id, color.name)
                            }
                          />
                        </li>
                      ))}
                    </div>
                  </div>
                )}
                <div className="d-flex mt-3 p-1">
                  <button type="button" className="btn btn-primary me-1 mb-1">
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
              <button type="button" className="btn btn-danger px-3 me-1 ms-2">
                <i className="fas fa-heart" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductCard
