var app = new Framework7({
  root: '#app',
  name: 'VetAgenda',
  id: 'br.com.suaclinica.vet',
  routes: [
    { path: '/home/', pageName: 'home' },
    { path: '/dashboard/', pageName: 'dashboard' },
    { path: '/pets/', pageName: 'pets' },
    { path: '/appointments/', pageName: 'appointments' },
    { path: '/anamnesis/', pageName: 'anamnesis' },
  ],
});

var mainView = app.views.create('.view-main');
document.getElementById('btnLogin').addEventListener('click', async function () {
  try {
    let user = await Auth.login(
      document.getElementById('loginEmail').value,
      document.getElementById('loginPassword').value
    );

    // Exibe nome do usuário (opcional)
    document.getElementById('userName').textContent = user.name;

    // 👉 Aqui está a mudança: em vez de ir para /dashboard/, vá direto para /appointments/
    mainView.router.navigate('/appointments/');
  } catch (e) {
    app.dialog.alert(e.message, 'Erro de login');
  }
});
document.addEventListener('deviceready', async function () {
  await DB.open();
  await DB.init();   // cria as tabelas
  await Auth.initSecure();
});
async function registerUser() {
  let name = document.getElementById('regName').value.trim();
  let email = document.getElementById('regEmail').value.trim();
  let password = document.getElementById('regPassword').value;
  let role = 'cliente';

  try {
    let hash = dcodeIO.bcrypt.hashSync(password, 10);
    await DB.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)`,
      [name, email, hash, role]
    );
    app.dialog.alert('Usuário registrado com sucesso!');
  } catch (e) {
    app.dialog.alert('Erro ao registrar: ' + e.message);
  }
}