const { GoogleGenAI } = require('@google/genai');
const env = require('../config/env');

const MODEL = 'gemini-3.5-flash';

function isAIAvailable() {
  return Boolean(env.geminiApiKey);
}

function getClient() {
  if (!isAIAvailable()) return null;
  return new GoogleGenAI({ apiKey: env.geminiApiKey });
}

async function generateText(prompt, maxOutputTokens = 800) {
  const ai = getClient();

  if (!ai) {
    return { available: false, text: '' };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens,
      },
    });

    const text = response?.text || '';

    if (!text.trim()) {
      return { available: false, text: '' };
    }

    return { available: true, text: text.trim() };
  } catch (err) {
    console.warn(
      '[gemini] AI request unavailable:',
      err?.message || err
    );

    return { available: false, text: '' };
  }
}

async function explainEvidence(evidenceList) {
  if (!isAIAvailable()) {
    return { available: false, text: '' };
  }

  const prompt = buildGroundedPrompt(evidenceList);
  return generateText(prompt, 800);
}

async function generateInterviewQuestions(evidenceList, jobContext) {
  if (!isAIAvailable()) {
    return { available: false, questions: [] };
  }

  const prompt = buildInterviewPrompt(evidenceList, jobContext);
  const result = await generateText(prompt, 1000);

  if (!result.available) {
    return { available: false, questions: [] };
  }

  return {
    available: true,
    questions: parseQuestionsFromText(result.text),
  };
}

function buildGroundedPrompt(evidenceList) {
  const evidenceText = evidenceList
    .map(
      (e) =>
        `Skill: ${e.skill} | Level: ${e.evidenceLevel} | Evidence: ${(
          e.evidenceItems || []
        )
          .map((i) => i.description)
          .join('; ')}`
    )
    .join('\n');

  return `You are explaining VERIFIED technical evidence to a hiring audience.

Rules:
- Only reference the evidence provided below.
- Never invent repositories, technologies, projects, or activity.
- Never claim the candidate is an expert or has professional mastery.
- Be concise and factual.
- If evidence is weak, clearly say it is weak.

Verified evidence:
${evidenceText}

Write a short 3-5 sentence plain-language explanation of the candidate's demonstrated technical evidence.`;
}

function buildInterviewPrompt(evidenceList, jobContext) {
  const evidenceText = evidenceList
    .map(
      (e) =>
        `Skill: ${e.skill} | Level: ${e.evidenceLevel} | Evidence: ${(
          e.evidenceItems || []
        )
          .map((i) => i.description)
          .join('; ')}`
    )
    .join('\n');

  return `Generate technical interview questions grounded ONLY in the verified evidence below.

Rules:
- Do not invent evidence.
- Do not assume a skill is known without evidence.
- STRONG/MODERATE evidence: ask the candidate to explain or demonstrate the skill using their actual evidence.
- WEAK/NO_EVIDENCE: ask how the candidate would learn, approach, or apply the skill.
- Questions must be practical and interview-relevant.
- Return exactly one question per line.
- Prefix every line with the skill name followed by a colon.

Job context:
${jobContext || 'General technical role'}

Verified evidence:
${evidenceText}`;
}

function parseQuestionsFromText(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [skill, ...rest] = line.split(':');

      return {
        skill: skill?.trim() || '',
        question: rest.join(':').trim(),
      };
    })
    .filter((q) => q.question);
}

module.exports = {
  isAIAvailable,
  explainEvidence,
  generateInterviewQuestions,
};
