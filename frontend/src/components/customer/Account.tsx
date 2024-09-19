import { useOutletDashBoard } from '../../views/customer/DashBoardOutlet'

function AccountView() {
  const { profile } = useOutletDashBoard()
  return (
    <div className="row rounded shadow p-3">
      <h2>Hi {profile.full_name}, </h2>
      <div className="col-lg-12 mb-4 mb-lg-0 h-100">
        From your account dashboard. you can easily check &amp; view your{' '}
        <a href="">orders</a>, manage your <a href="">shipping</a>
        <a href="">Edit Account</a>
      </div>
    </div>
  )
}

export default AccountView
