from fastapi import FastAPI
from .routes import warga, quiz, report
app = FastAPI(title='EcoQuiz Backend v2')
app.include_router(warga.router)
app.include_router(quiz.router)
app.include_router(report.router)
