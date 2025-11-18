// Render modules
quiz.questions.forEach((qs,idx)=>{
html += `<div style='margin:8px 0'><p><strong>${idx+1}.</strong> ${qs.q}</p>`;
qs.options.forEach((opt,o)=>{
html += `<label style='display:block'><input type='radio' name='q${idx}' value='${o}'> ${opt}</label>`;
});
html += `</div>`;
});
html += `<button type='button' class='btn' onclick="submitQuiz('${quizId}')">Enviar</button></form><div id='quizResult'></div></div>`;
area.innerHTML = html;
}


function submitQuiz(quizId){
const quiz = PORTAL_DATA.quizzes.find(x=>x.id===quizId);
const form = document.getElementById('quizForm');
const answers = [];
quiz.questions.forEach((q,idx)=>{
const sel = form['q'+idx];
let val = null;
if(sel){ for(const el of sel){ if(el.checked) { val = el.parentNode.textContent.trim(); break; }} }
answers.push(val);
});
// grade
let score=0;
quiz.questions.forEach((q,idx)=>{ if(answers[idx] && answers[idx]===q.options[q.answer]) score++; });
document.getElementById('quizResult').innerHTML = `<div class='result'>Você acertou ${score} de ${quiz.questions.length} (${Math.round(score/quiz.questions.length*100)}%)</div>`;
}


// Simulados (com timer)
const simuladosList = document.getElementById('simuladosList');
PORTAL_DATA.simulated_tests.forEach(s=>{
const d = document.createElement('div'); d.className='card';
d.innerHTML = `<h3>${s.title}</h3><p>Tempo: ${Math.round(s.time/60)} min</p><a class='btn' href='#' onclick="startSimulado('${s.id}')">Iniciar</a>`;
simuladosList.appendChild(d);
});


function startSimulado(id){
const sim = PORTAL_DATA.simulated_tests.find(x=>x.id===id);
if(!sim) return;
const runner = document.getElementById('simuladoRunner');
let timeLeft = sim.time;
let current = 0;
let userAnswers = [];
function renderQuestion(){
const q = sim.questions[current];
runner.innerHTML = `<div class='sim-card'><h3>Questão ${current+1} de ${sim.questions.length}</h3><p>${q.q}</p>${q.options.map((o,i)=>`<label style='display:block'><input name='sim_q' type='radio' value='${i}'> ${o}</label>`).join('')}<div style='margin-top:12px'><button class='btn' onclick='nextQ()'>Próxima</button></div><div id='timer'>Tempo restante: ${timeLeft}s</div></div>`;
}
window.nextQ = function(){
const chosen = document.querySelector("input[name='sim_q']:checked");
userAnswers.push(chosen?parseInt(chosen.value):-1);
current++;
if(current>=sim.questions.length){ finish(); return; }
renderQuestion();
}
function finish(){
// grade
let score=0; sim.questions.forEach((q,i)=>{ if(userAnswers[i]===q.answer) score++; });
runner.innerHTML = `<div class='card'><h3>Resultado: ${score} / ${sim.questions.length}</h3><p>Acertos: ${Math.round(score/sim.questions.length*100)}%</p></div>`;
clearInterval(timer);
}
renderQuestion();
const timer = setInterval(()=>{ timeLeft--; const t = document.getElementById('timer'); if(t) t.textContent = 'Tempo restante: '+timeLeft+'s'; if(timeLeft<=0){ finish(); } },1000);
}


// Inicializar: renderizar módulo inicial


// Exibir quizzes rápidos na área de exercícios
const exerciseArea = document.getElementById('exerciseArea');
exerciseArea.innerHTML = `<div class='card'><h3>Quizzes rápidos</h3>${PORTAL_DATA.quizzes.map(q=>`<div style='margin:6px 0'><strong>${q.title}</strong> <button class='btn' onclick="openQuiz('${q.id}')">Abrir</button></div>`).join('')}</div>`;
