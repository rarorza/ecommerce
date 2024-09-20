interface Props {
  bgColor: string
  title: string
  content: string
  collumLenght?: number | null
  marginTop?: number
}

function CardOrder({
  bgColor,
  title,
  content,
  collumLenght = 3,
  marginTop,
}: Props) {
  return (
    <div
      className={`col-lg-${collumLenght} mb-4 mb-lg-0 ${marginTop ? `mt-${marginTop}` : ''}`}
    >
      <div className="rounded shadow" style={{ backgroundColor: `${bgColor}` }}>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="">
              <p className="mb-1">{title}</p>
              <h2 className="mb-0">
                {content}
                <span className="" style={{ fontSize: '0.875rem' }}></span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardOrder
