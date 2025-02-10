import { validateCompleteName, validatePhone } from "./validate.js";
import debounce from "./debounce.js";
import Toast from "./toast.js";

const toast = new Toast();

export default class Form {
  constructor(formElement) {
    this.errorTypes = [
      "valueMissing",
      "typeMismatch",
      "customError",
      "patternMismatch",
      "tooShort",
    ];

    this.errorMessages = {
      "complete-name": {
        valueMissing: "O campo de nome não pode estar vazio.",
        patternMismatch: "Por favor, preencha um nome válido.",
        tooShort: "Por favor, preencha um nome válido.",
      },
      email: {
        valueMissing: "O campo de e-mail não pode estar vazio.",
        typeMismatch: "Por favor, preencha um email válido.",
        tooShort: "Por favor, preencha um email válido.",
      },
      phone: {
        valueMissing: "O campo de telefone não pode estar vazio.",
        tooShort: "O campo de celular não tem dígitos suficientes.",
      },
      course: {
        valueMissing: "Selecione o curso que tem interesse.",
      },
    };

    this.formElement = formElement;
    this.fields = this.formElement.querySelectorAll("[required]");
    this.disableDefaultError();
    this.enabledPhoneMask();
    this.initFields();
    this.initSubmit();
  }

  initSubmit() {
    const form = this.formElement;
    const toast = new Toast();

    form.querySelector("[type='submit']").addEventListener("click", () => {
      this.fields.forEach((field) => {
        this.checkField(field);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const param = new URLSearchParams(window.location.search);
      param.forEach((value, key) => {
        formData.set(key, value);
      });

      const pixelResponse = await fetch("../pixel-submit.php", {
        method: "POST",
        body: formData,
      });

      try {
        const rdResponse = await fetch("../rd-submit.php", {
          method: "POST",
          body: formData,
        });

        const result = await rdResponse.json();

        if (result.erro) {
          toast.createToast(result.errorMessage, "error");
        } else {
          const url = "./bem-vindo.html";

          toast.createToast("Formulário enviado com sucesso!", "success");
          this.formElement.reset();
          window.open(url, '_blank');
        }
      } catch (error) {
        toast.createToast(
          "Erro na submissão do formulário. Tente novamente.",
          "error"
        );
      }
    });
  }

  disableDefaultError() {
    this.formElement
      .querySelectorAll("[required]")
      .forEach((field) =>
        field.addEventListener("invalid", (e) => e.preventDefault())
      );
  }

  initFields() {
    this.fields.forEach((field) => {
      const errorMessage = field.nextElementSibling;
      const checkFunc = debounce(() => {
        this.checkField(field);
      }, 500);

      if (field.tagName === "INPUT") {
        field.addEventListener("keyup", (e) => {
          e.preventDefault();
          checkFunc();
        });
      } else if (field.tagName === "SELECT") {
        field.addEventListener("change", (e) => {
          e.preventDefault();
          checkFunc();
        });
      }
    });
  }

  enabledPhoneMask() {
    this.formElement.querySelectorAll("[type='tel']").forEach((tel) => {
      tel.addEventListener("input", (e) => {
        let formattedNumber = e.target.value.replace(/\D/g, "");
        if (formattedNumber.length > 11) {
          formattedNumber = formattedNumber.slice(0, 11);
        }
        formattedNumber = formattedNumber.replace(/^(\d{2})(\d)/g, "($1) $2");
        formattedNumber = formattedNumber.replace(/(\d)(\d{4})$/, "$1-$2");

        e.target.value = formattedNumber;
      });
    });
  }

  checkField(field) {
    let msg;
    field.setCustomValidity("");
    if (field.name == "complete-name") {
      validateCompleteName(field, 2, 2);
    } else if (field.name == "phone") {
      validatePhone(field);
    }

    this.errorTypes.forEach((erro) => {
      if (field.validity[erro]) {
        msg = this.errorMessages[field.name][erro];
        if (erro === "customError") msg = field.validationMessage;
      }
    });

    const inputValidator = field.checkValidity();
    const messageBox = field.nextElementSibling;

    if (!inputValidator && !field.disabled) {
      field.classList.add("error");
      messageBox.innerText = msg;
      messageBox.classList.add("error");
    } else {
      field.classList.remove("error");
      messageBox.innerText = "";
      messageBox.classList.remove("error");
    }
  }
}
