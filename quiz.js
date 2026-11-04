// Multiple-choice self-check quizzes (no Python needed).
//
// Markup for one question:
//   <div class="exercise quiz" data-answer="2">
//   <h2>Title</h2>
//   <p>Question text</p>
//   <ul class="choices"><li>option 1</li><li>option 2</li>...</ul>
//   <div class="explanation">shown after answering</div>
//   </div>
// data-answer: number(s) of the correct option(s), counting from 1, e.g. "2" or "1,4".
// Several correct options give checkboxes and a "Check" button.
// The score goes into the element with id "quiz-score"; the button with id
// "quiz-reset" starts the quiz again.

const quizzes = document.querySelectorAll(".quiz");
const results = new Array(quizzes.length).fill(null);

function updateScore() {
    const box = document.getElementById("quiz-score");
    if (!box) return;
    const answered = results.filter(r => r !== null).length;
    const right = results.filter(r => r === true).length;
    let text = "Score: " + right + " / " + quizzes.length;
    if (answered < quizzes.length) {
        text += " (" + (quizzes.length - answered) + " left)";
    }
    box.textContent = text;
}

function grade(quiz, q, answer) {
    const items = quiz.querySelectorAll(".choices li");
    const chosen = [];
    items.forEach((li, i) => {
        if (li.querySelector("input").checked) chosen.push(i);
    });
    if (chosen.length === 0) return;

    items.forEach((li, i) => {
        const input = li.querySelector("input");
        input.disabled = true;
        if (answer.includes(i)) {
            li.classList.add("correct");
        } else if (input.checked) {
            li.classList.add("wrong");
        }
    });

    const ok = chosen.length === answer.length && chosen.every(i => answer.includes(i));
    results[q] = ok;

    const feedback = quiz.querySelector(".feedback");
    feedback.textContent = ok ? "✔ Correct!" : "✘ Not quite.";
    feedback.className = "feedback " + (ok ? "right" : "wrong");

    const check = quiz.querySelector(".check-button");
    if (check) check.disabled = true;

    quiz.classList.add("answered");
    updateScore();
}

quizzes.forEach((quiz, q) => {
    // numbering questions
    const h = quiz.querySelector("h2");
    if (h) {
        h.textContent = "Question " + String(q + 1).padStart(2, "0") + " -- " + h.textContent;
    }

    const answer = quiz.dataset.answer.split(",").map(s => parseInt(s.trim()) - 1);
    const multi = answer.length > 1;

    // turn every option into a radio button (or checkbox) with a label
    quiz.querySelectorAll(".choices li").forEach((li, i) => {
        const input = document.createElement("input");
        input.type = multi ? "checkbox" : "radio";
        input.name = "q" + q;
        input.value = i;
        const label = document.createElement("label");
        label.append(input, ...Array.from(li.childNodes));
        li.append(label);
        if (!multi) {
            input.addEventListener("change", () => grade(quiz, q, answer));
        }
    });

    const feedback = document.createElement("p");
    feedback.className = "feedback";
    quiz.querySelector(".choices").after(feedback);

    if (multi) {
        const check = document.createElement("button");
        check.className = "run-button check-button";
        check.textContent = "Check";
        check.addEventListener("click", () => grade(quiz, q, answer));
        feedback.before(check);
    }
});

const reset = document.getElementById("quiz-reset");
if (reset) {
    reset.addEventListener("click", () => {
        quizzes.forEach((quiz, q) => {
            results[q] = null;
            quiz.classList.remove("answered");
            quiz.querySelectorAll(".choices li").forEach(li => {
                li.classList.remove("correct", "wrong");
                const input = li.querySelector("input");
                input.checked = false;
                input.disabled = false;
            });
            const feedback = quiz.querySelector(".feedback");
            feedback.textContent = "";
            feedback.className = "feedback";
            const check = quiz.querySelector(".check-button");
            if (check) check.disabled = false;
        });
        updateScore();
        window.scrollTo(0, 0);
    });
}

updateScore();
