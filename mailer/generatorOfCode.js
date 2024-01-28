module.exports = () => {
  let code = [];

  for (let i = 0; i < 6; i++) {
    code[i] = Math.floor(Math.random() * 9 + 1);
  }

  return code.join("");
};
