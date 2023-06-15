async function handleSignup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username, password);
  try {
    await axios.post("/login", {
      username: username,
      password: password,
    });
    // if (username === "" || password === "") {
    //   alert("Nhập đầy đủ mới cho vô nghe nhạc nha ");
    // } else if (username == true && password == true) {
    //   // alert("Đăng ký thành công");
    // } else {
    //   alert("Cái này người ta xài rồi. Đặt cái khác đi!");
    // }
    if (username === "" || password === "") {
      alert("Nhập đầy đủ mới cho vô nghe nhạc nha ");
    } else if (username != null && password != null) {
      alert("Đăng nhập thành công");
      // Khỏi thông báo!
    }
    if (username == null && password == null) {
      alert("Sai rồi làm lại !");
    }
    // if (username === "" || password === "") {
    //   alert("Nhập đầy đủ mới cho vô nghe nhạc nha!");
    // } else if (
    //   username !== req.body.username ||
    //   password !== req.body.password
    // ) {
    //   // alert("Đăng nhập thành công");
    // } else {
    //   alert("Cái này người ta xài rồi. Đặt cái khác đi!");
    // }
  } catch {
    alert("Lỗi dữ liệu");
  }
}
