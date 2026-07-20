import type { Metadata } from "next";
import QuizApp from "@/components/quiz/QuizApp";

export const metadata: Metadata = {
  title: "PDF Quiz Trainer",
  description:
    "Upload a questions & answers PDF and practice it one question at a time — entirely in your browser.",
  robots: { index: false },
};

export default function QuizPage() {
  return <QuizApp />;
}
