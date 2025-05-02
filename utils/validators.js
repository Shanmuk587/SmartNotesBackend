const validateEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };
  
  const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  module.exports = {
    validateEmail,
    validatePassword,
  };