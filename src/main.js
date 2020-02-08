import axios from "axios";

class App {
  constructor() {
    this.repositories = [];

    this.formElement = document.getElementById("repo-form");
    this.listElement = document.getElementById("repo-list");
    this.inputEl = document.querySelector("input[name=repository]");

    this.registerHandlers();
  }

  registerHandlers() {
    this.formElement.onsubmit = event => this.addRepository(event);
  }

  setLoading(loading = true) {
    if (loading === true) {
      let loadingEl = document.createElement("span");
      loadingEl.appendChild(document.createTextNode("Carregando"));
      loadingEl.setAttribute("id", "loading");

      this.formElement.appendChild(loadingEl);
    } else {
      document.getElementById("loading").remove();
    }
  }

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    if (repoInput.length === 0) return;

    this.setLoading();

    try {
      const response = await axios.get(
        `https://api.github.com/repos/${repoInput}`
      );

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputEl.value = "";

      this.render();
    } catch (err) {
      alert("O repositório não existe!");
      this.inputEl.value = "";
    }

    this.setLoading(false);
  }

  render() {
    this.listElement.innerHTML = "";

    this.repositories.forEach(repo => {
      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", repo.avatar_url);

      let titleEl = document.createElement("strong");
      titleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement("p");
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement("a");
      linkEl.setAttribute("target", "_blank");
      linkEl.setAttribute("href", repo.html_url);
      linkEl.appendChild(document.createTextNode("Acessar"));

      let listItemEl = document.createElement("li");
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(titleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEl);

      this.listElement.appendChild(listItemEl);
    });
  }
}

new App();
