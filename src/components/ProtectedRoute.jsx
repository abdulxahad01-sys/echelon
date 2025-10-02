import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import LoadingSpinner from './ui/LoadingSpinner'

const ProtectedRoute = ({ children }) => {
  const { user, profile, loading, navigateToPortfolio, isTrialActive, subscribed, checkSubscription, subscriptionLoading } = useAuth()
  const [accessChecked, setAccessChecked] = useState(false)

  useEffect(() => {
    const verifyAccess = async () => {
      if (user && profile && !accessChecked) {
        await checkSubscription()
        setAccessChecked(true)
      }
    }
    verifyAccess()
  }, [user, profile, checkSubscription, accessChecked])

  if (loading || subscriptionLoading || (user && (!profile || !accessChecked))) {
    return (
      <LoadingSpinner 
        fullScreen={true}
        text={loading ? 'Loading...' : 'Checking access...'}
      />
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  // Check trial or subscription access
  const hasAccess = navigateToPortfolio || isTrialActive || subscribed;
  
  if (!hasAccess) {
    return <Navigate to="/membership" replace />
  }

  return children
}

export default ProtectedRoute