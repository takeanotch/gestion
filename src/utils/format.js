export const formatDate = (dateString, language = 'fr') => {
  const date = new Date(dateString)
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return date.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB', options)
}

export const formatCurrency = (amount, language = 'fr') => {
  return new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: language === 'fr' ? 'EUR' : 'USD'
  }).format(amount)
}