const { runCpp } = require("./src/utils/problemutils");

const code = `
#include <iostream>
using namespace std;

int main() {
  int a, b,c;
  cin >> a >> b>>c;
  cout << a + b+c;
}
`;

runCpp(code, "10 20 30")
  .then(output => console.log("OUTPUT:", output))
  .catch(err => console.error("ERROR:", err));
