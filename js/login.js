async function handleLogin() {
  const email = document.querySelector(".input-login-email");
  const password = document.querySelector(".input-login-password");
  // console.log(email, password);
  axios
    .post("/mp3-player", {
      email: email.value,
      password: password.value,
    })
    .then(function (response) {
      console.log(response.data);
      // if (response) {
      //   if (response.status == 200) {
      //     alert(response.data.message);
      //     console.log(response);
      //   }
      // }
      // if (response.data.message == "Đăng nhập thành công") {
      //   return (location.href = "/mp3-player");
      // }
      // if (response.data.message == "Sai mật khẩu") {
      //   return (location.href = "/");
      // }
      // if (response.data.message == "Có lỗi xảy ra trong khi xử lý") {
      //   return (location.href = "/");
      // }
      // if (response.data.message == "Thông tin đăng nhập không hợp lệ") {
      //   return (location.href = "/");
      // }
    })
    .catch(function (error) {
      console.log(error);
    });
  // if (email == "" || password == "") {
  //   alert("Nhập đầy đủ mới cho vô nghe nhạc nha");
  // } else {
  //   try {
  //     await axios({
  //       method: "post",
  //       url: "/mp3-player",
  //       data: {
  //         email: email,
  //         password: password,
  //       },
  //     }).then((res) => {
  //       if (res.email == email && res.password == password) {
  //         console.log(res.email);
  //         alert("Đăng nhập thành công");
  //         // window.location.href = "/mp3-player";
  //       } else {
  //         console.log(res.email);
  //         alert("Sai rồi làm lại !");
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}
