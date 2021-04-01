App = {
  loading: false,
  contracts: {},

  load: async () => {
    await App.loadWeb3();

    await App.loadAccount();
    await App.loadContract();

    await App.render();
  },
  //for more info on how to import Web3 (which connects your client application to Metamask)
  //please check
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    var accounts = await ethereum.request({ method: "eth_accounts" });
    console.log("here " + accounts[0]);

    if (typeof web3 !== "undefined") {
      console.log("loadded...");
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      let accounts = await web3.eth.getAccounts();
      web3.eth.defaultAccount = accounts[0];
    } else {
      window.alert("Please connect to Metamask.");
    }
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        console.log("it works");
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    //To load all your connected accounts on Metamask
    //App.account = web3.eth.accounts[0]; //deprecated for more info check https://docs.metamask.io/guide/provider-migration.html#replacing-window-web3
    var accounts = await ethereum.request({ method: "eth_accounts" });
    //web3.eth.defaultAccount = accounts;
    App.account = accounts;
    App.defaultAccount = accounts;
    console.log("here mmmmm" + App.account);
    console.log("here mmmmm defualt" + App.defaultAccount);
  },
  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    App.contracts.TodoList = TruffleContract(todoList);
    App.contracts.TodoList.setProvider(App.web3Provider);
    App.todoList = await App.contracts.TodoList.deployed();
    console.log(todoList);
  },
  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount();
    const $taskTemplate = $(".taskTemplate");

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i);
      const taskId = task[0].toNumber();
      const taskContent = task[1];
      const taskCompleted = task[2];

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(taskContent);
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .on("click", App.toggleCompleted);

      // Put the task in the correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // Show the task
      $newTaskTemplate.show();
    }
  },
  createTask: async () => {
    App.setLoading(true);
    const transactionObject = {
      from: "0x7570C31e902b9339C8D114F19736255aFF91f1aB",
    };
    const todoList = await $.getJSON("TodoList.json");
    const content = $("#newTask").val();
    //executes your contract function over Metamask
    await App.todoList.createTask.sendTransaction(content, {
      from: "0x7570C31e902b9339C8D114F19736255aFF91f1aB",
    });

    //await App.todoList.createTask(content);

    window.location.reload();
  },
  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    await App.todoList.toggleCompleted.sendTransaction(taskId, {
      from: "0x7570C31e902b9339C8D114F19736255aFF91f1aB",
    });
    window.location.reload();
  },

  render: async () => {
    // Prevent double render
    if (App.loading) {
      return;
    }

    // Update app loading state
    App.setLoading(true);

    // Render Account
    $("#account").html(App.account);

    // Render Tasks
    await App.renderTasks();

    // Update loading state
    App.setLoading(false);
  },
  setLoading: (boolean) => {
    App.loading = boolean;
    const loader = $("#loader");
    const content = $("#content");
    if (boolean) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
