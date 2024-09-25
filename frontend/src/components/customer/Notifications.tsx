import apiInstance from '../../utils/axios'
import GetUserData from '../../utils/plugins/GetUserData'
import { useEffect, useState, useRef } from 'react'
import { IOrder } from '../../shared/order.interface'
import { IUser } from '../../shared/user.interface'
import { IVendor } from '../../shared/vendor.interface'
import moment from 'moment'

interface INotification {
  id: number
  date: string
  order?: IOrder | null
  seen: boolean
  user: IUser
  vendor?: IVendor | null
}

function Notifications() {
  const [notifications, setNotifications] = useState<INotification[]>()
  const userData = GetUserData()

  // Mark notifications as seen when show in viewport ->
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  const notificationsRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const observers: IntersectionObserver[] = []
  useEffect(() => {
    notifications?.forEach((n, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!n.seen) {
            if (entry.isIntersecting) {
              const notificationId = notificationsRefs.current[index]?.id
              markNotificationAsSeen(parseInt(notificationId!))
            }
          }
        },
        { threshold: 0.1 }, // Trigger when 10% of the element is visible
      )

      if (notificationsRefs.current[index]) {
        observer.observe(notificationsRefs.current[index]!)
        observers.push(observer)
        // The reason we store all observers in this array is to keep track of each IntersectionObserver instance,
        // allowing us to clean them up later by disconnecting them when the component unmounts (during the cleanup phase).
      }
    })

    // Cleanup observers on unmount
    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [notifications])

  const markNotificationAsSeen = async (notificationId: number) => {
    try {
      await apiInstance.get(
        `customer/notification/${userData?.user_id}/${notificationId}`,
      )
    } catch (error) {
      console.log(error)
    }
  }
  // <-

  const getNotificationData = async () => {
    try {
      const res = await apiInstance.get(
        `customer/notification/${userData?.user_id}`,
      )
      setNotifications(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNotificationData()
  }, [])
  return (
    <div className="container px-4">
      <section className="">
        <h3 className="mb-3">
          <i className="fas fa-bell" /> Notifications{' '}
        </h3>
        <div className="list-group">
          {notifications?.map((n, index) => (
            <a
              key={index}
              href="#"
              className={`list-group-item list-group-item-action ${!n.seen ? 'active' : ''}`}
              onClick={() => markNotificationAsSeen(n.id)}
              id={n.id.toString()}
              ref={(el) => (notificationsRefs.current[index] = el)}
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">List group item heading</h5>
                <small className={n.seen ? `text-muted` : ''}>
                  {moment(n.date).format('H:mm - MMMM D, YYYY')}
                </small>
              </div>
              <p className="mb-1">Some placeholder content in a paragraph.</p>
              <i className={`fas me-1 ${!n.seen ? 'fa-eye' : ''}`}></i>
              <small className={n.seen ? `text-muted` : ''}>
                And some muted small print.
              </small>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Notifications
