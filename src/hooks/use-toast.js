export const useToast = () => {
  const toast = ({ title, description, variant = 'default' }) => {
    console.log(`Toast: ${title} - ${description}`)
  }

  return { toast }
}