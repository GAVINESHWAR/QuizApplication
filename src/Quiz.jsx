import React, { useState, useEffect } from "react";

const QuizApp = () => {
  // States of the options
  const [email, setEmail] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [quizState, setQuizState] = useState("start"); // start, quiz, report
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = () => window.location.reload(true);
  // CSS styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "20px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "20px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      textAlign: "center",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "4px",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
      margin: "5px",
    },
    buttonOutline: {
      backgroundColor: "white",
      border: "1px solid #007bff",
      color: "#007bff",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
    },
    navigationContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px",
    },
    navigationButton: {
      width: "40px",
      height: "40px",
      border: "1px solid #007bff",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
    timer: {
      fontSize: "24px",
      textAlign: "center",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    error: {
      color: "red",
      marginBottom: "10px",
    },
    questionText: {
      fontSize: "18px",
      marginBottom: "20px",
    },
    choiceButton: {
      width: "100%",
      textAlign: "left",
      padding: "10px",
      margin: "5px 0",
      border: "1px solid #ddd",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "white",
    },
    selectedChoice: {
      backgroundColor: "#007bff",
      color: "white",
    },
    navigationButtons: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
    },
    reportGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginTop: "20px",
    },
    correct: {
      backgroundColor: "#d4edda",
      padding: "10px",
      borderRadius: "4px",
    },
    incorrect: {
      backgroundColor: "#f8d7da",
      padding: "10px",
      borderRadius: "4px",
    },
  };

  // Fetch questions from given API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://opentdb.com/api.php?amount=15");
      const data = await response.json();

      // Process questions to include shuffled choices
      const processedQuestions = data.results.map((q) => ({
        ...q,
        choices: [...q.incorrect_answers, q.correct_answer].sort(
          () => Math.random() - 0.5
        ),
      }));

      setQuestions(processedQuestions);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch questions. Please try again.");
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (quizState === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setQuizState("report");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState, timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle start quiz
  const handleStart = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    fetchQuestions();
    setQuizState("quiz");
  };

  // Handle answer selection
  const handleAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  // Handle question navigation
  const navigateToQuestion = (index) => {
    setCurrentQuestion(index);
    setVisitedQuestions((prev) => new Set([...prev, index]));
  };

  // Render question navigation panel
  const QuestionNavigation = () => (
    <div style={styles.navigationContainer}>
      {questions.map((_, index) => (
        <button
          key={index}
          style={{
            ...styles.navigationButton,
            backgroundColor: currentQuestion === index ? "#007bff" : "white",
            color: currentQuestion === index ? "white" : "#007bff",
          }}
          onClick={() => navigateToQuestion(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );

  // Render start page
  if (quizState === "start") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Quiz Application</h1>
          <form onSubmit={handleStart}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" style={styles.button}>
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render quiz
  if (quizState === "quiz") {
    if (loading) {
      return (
        <div style={{ ...styles.container, textAlign: "center" }}>
          Loading questions...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ ...styles.container, textAlign: "center", color: "red" }}>
          {error}
        </div>
      );
    }

    const currentQ = questions[currentQuestion];
    if (!currentQ) return null;

    return (
      <div style={styles.container}>
        <div style={styles.timer}>Time Remaining: {formatTime(timeLeft)}</div>

        <QuestionNavigation />

        <div style={styles.card}>
          <h2 style={styles.title}>
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <p
            style={styles.questionText}
            dangerouslySetInnerHTML={{ __html: currentQ.question }}
          />

          <div>
            {currentQ.choices.map((choice, index) => (
              <button
                key={index}
                style={{
                  ...styles.choiceButton,
                  ...(answers[currentQuestion] === choice
                    ? styles.selectedChoice
                    : {}),
                }}
                onClick={() => handleAnswer(currentQuestion, choice)}
                dangerouslySetInnerHTML={{ __html: choice }}
              />
            ))}
          </div>

          <div style={styles.navigationButtons}>
            <button
              style={{
                ...styles.button,
                ...(currentQuestion === 0 ? styles.buttonOutline : {}),
              }}
              onClick={() =>
                navigateToQuestion(Math.max(0, currentQuestion - 1))
              }
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            <button
              style={styles.button}
              onClick={() => {
                if (currentQuestion === questions.length - 1) {
                  setQuizState("report");
                } else {
                  navigateToQuestion(currentQuestion + 1);
                }
              }}
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render report
  if (quizState === "report") {
    const score = questions.reduce(
      (acc, q, index) => acc + (answers[index] === q.correct_answer ? 1 : 0),
      0
    );

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Quiz Report</h1>
          <p style={{ ...styles.questionText, fontWeight: "bold" }}>
            Final Score: {score} out of {questions.length}
          </p>
        </div>

        {questions.map((q, index) => (
          <div key={index} style={styles.card}>
            <h3 style={{ ...styles.title, fontSize: "20px" }}>
              Question {index + 1}
            </h3>
            <p
              style={styles.questionText}
              dangerouslySetInnerHTML={{ __html: q.question }}
            />

            <div style={styles.reportGrid}>
              <div>
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Your Answer:
                </p>
                <p
                  style={
                    answers[index] === q.correct_answer
                      ? styles.correct
                      : styles.incorrect
                  }
                  dangerouslySetInnerHTML={{
                    __html: answers[index] || "Not answered",
                  }}
                />
              </div>
              <div>
                <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Correct Answer:
                </p>
                <p
                  style={styles.correct}
                  dangerouslySetInnerHTML={{ __html: q.correct_answer }}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          style={{
            width: "10hv",
            height: "10vh",
            background: "Blue",
            color: "white",
            padding: "15px",
            margin: "2px",
            borderRadius: "12px",
            cursor:"pointer",
          }}
          onClick={refresh}
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  return null;
};

export default QuizApp;
