//Đối tượng Validator
//Đối tượng Validator
function Validator(options) {
  var selectorRules = {};
  function validate(inputElement, rule) {
    // Hàm thực hiện validate
    // var erroMessage = rule.test(inputElement.value);
    var erroMessage;
    var errorElement =
      inputElement.parentElement.querySelector(".form-message");

    // Lấy ra các rules của selector
    var rules = selectorRules[rule.selector];

    // Lặp qua từng rule và kiểm tra
    // Nếu có lỗi thì dừng việc kiểm tra
    for (var i = 0; i < rules.length; i++) {
      erroMessage = rules[i](inputElement.value);
      if (erroMessage) break;
    }

    if (erroMessage) {
      errorElement.innerText = erroMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
    return !erroMessage;
  }
  // Lấy element của form cần validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    // Khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      // Lặp qua từng rules và vali
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        if (typeof options.onsubmit === "function") {
          var enableInputs = formElement.querySelectorAll("[name]");
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            return (values[input.name] = input.value) && values;
          },
          {});
          options.onsubmit(formValues);
        } else {
          formElement.submit();
        }
      }
    };
    // Lặp qua mỗi rule và xử lý (Lắng nghe sự kiện blur, input,...)
    options.rules.forEach(function (rule) {
      // Lưu lại các rules cho mỗi input
      // selectorRules[rule.selector] = rule.test;

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
          //   console.log(inputElement.value);
        };
        // Xử lý khi người dùng nhập input
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.errorSelector
          );
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}
//Định nghĩa rules
// Nguyên tắc của các rules:
// 1. Khi có lỗi => Trả ra message lỗi
// 2. khi không có lỗi = > Không trả ra cái gì hết (Undefined)
Validator.isUsername = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim()
        ? undefined
        : message || "Please enter this information";
    },
  };
};
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      // return value.trim() ? undefined : "Vui lòng nhập trường này!";
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "This field must be email";
    },
  };
};
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      // return value.trim() ? undefined : "Vui lòng nhập trường này!";
      return value.length >= min
        ? undefined
        : message || `Enter at least ${min} characters`;
    },
  };
};
