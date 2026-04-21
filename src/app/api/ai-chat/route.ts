import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const SYMPTOM_RESPONSES: Record<string, string> = {
  headache: `**Headache** — Common causes include dehydration, stress, or tension.\n\n✅ **Self-care:** Rest in a quiet dark room, drink water, take paracetamol if needed.\n\n⚠️ **See a nurse if:** headache is severe, sudden, or accompanied by fever, stiff neck, or vision changes.`,
  fever: `**Fever** — A temperature above 37.5°C indicates your body is fighting an infection.\n\n✅ **Self-care:** Stay hydrated, rest, take paracetamol to reduce temperature.\n\n⚠️ **See a nurse if:** fever is above 39°C, lasts more than 3 days, or you have difficulty breathing.`,
  cough: `**Cough** — Could be due to a cold, flu, allergies, or throat irritation.\n\n✅ **Self-care:** Stay hydrated, use honey and warm water, avoid cold drinks.\n\n⚠️ **See a nurse if:** cough lasts more than 2 weeks, produces blood, or is accompanied by chest pain.`,
  cold: `**Common Cold** — Caused by a virus, usually resolves in 7–10 days.\n\n✅ **Self-care:** Rest, drink fluids, use saline nasal spray, take paracetamol for discomfort.\n\n⚠️ **See a nurse if:** symptoms worsen after day 5 or you develop a high fever.`,
  sore: `**Sore Throat** — Often caused by viral infections or dry air.\n\n✅ **Self-care:** Gargle warm salt water, drink warm fluids, use throat lozenges.\n\n⚠️ **See a nurse if:** you have difficulty swallowing, white patches on tonsils, or fever above 38°C.`,
  stomach: `**Stomach Pain / Nausea** — Can be caused by indigestion, food poisoning, or stress.\n\n✅ **Self-care:** Eat light foods (rice, toast), stay hydrated, avoid spicy or fatty foods.\n\n⚠️ **See a nurse if:** pain is severe, persistent, or accompanied by vomiting blood or high fever.`,
  diarrhea: `**Diarrhoea** — Usually caused by infection or food intolerance.\n\n✅ **Self-care:** Drink plenty of fluids (oral rehydration salts if available), eat bland foods.\n\n⚠️ **See a nurse if:** it lasts more than 2 days, there is blood in stool, or you feel severely dehydrated.`,
  dizzy: `**Dizziness** — Can be caused by dehydration, low blood sugar, or standing up too quickly.\n\n✅ **Self-care:** Sit or lie down immediately, drink water, eat something if you haven't eaten.\n\n⚠️ **See a nurse if:** dizziness is severe, recurring, or accompanied by chest pain or fainting.`,
  rash: `**Skin Rash** — Can be caused by allergies, heat, or infections.\n\n✅ **Self-care:** Avoid scratching, apply cool compress, use unscented moisturiser.\n\n⚠️ **See a nurse if:** rash spreads rapidly, is painful, blistering, or accompanied by fever.`,
  tired: `**Fatigue / Tiredness** — Common causes include poor sleep, stress, anaemia, or illness.\n\n✅ **Self-care:** Ensure 7–9 hours of sleep, eat balanced meals, stay hydrated, reduce stress.\n\n⚠️ **See a nurse if:** fatigue is extreme, persistent for weeks, or accompanied by other symptoms.`,
  back: `**Back Pain** — Often caused by poor posture, muscle strain, or prolonged sitting.\n\n✅ **Self-care:** Apply warm compress, gentle stretching, avoid heavy lifting, take paracetamol.\n\n⚠️ **See a nurse if:** pain radiates down your leg, is severe, or follows an injury.`,
  chest: `**Chest Pain** — This can range from muscle strain to more serious conditions.\n\n⚠️ **Important:** Chest pain should always be evaluated by a healthcare professional.\n\n🚨 **Seek immediate help if:** pain is crushing, spreads to your arm or jaw, or you have difficulty breathing.`,
  anxiety: `**Anxiety / Stress** — Very common among students. Symptoms include racing heart, worry, and difficulty sleeping.\n\n✅ **Self-care:** Deep breathing exercises, regular physical activity, limit caffeine, talk to someone you trust.\n\n⚠️ **See a nurse if:** anxiety is affecting your daily life or you feel overwhelmed.`,
  period: `**Menstrual Pain (Dysmenorrhoea)** — Cramping during periods is common.\n\n✅ **Self-care:** Apply heat to lower abdomen, take ibuprofen or paracetamol, rest.\n\n⚠️ **See a nurse if:** pain is severe, periods are irregular, or you have unusually heavy bleeding.`,
  eye: `**Eye Irritation / Redness** — Can be caused by allergies, dryness, or conjunctivitis.\n\n✅ **Self-care:** Avoid rubbing eyes, use clean water to rinse, rest your eyes from screens.\n\n⚠️ **See a nurse if:** there is discharge, significant pain, or vision changes.`,
}

function getResponse(message: string): string {
  const lower = message.toLowerCase()

  for (const [keyword, response] of Object.entries(SYMPTOM_RESPONSES)) {
    if (lower.includes(keyword)) return response
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return `Hello! 👋 I'm the BHRS Health Assistant. I can help you understand basic symptoms.\n\nTry asking about: **headache, fever, cough, sore throat, stomach pain, dizziness, rash, fatigue, back pain, chest pain, anxiety**, and more.\n\n⚠️ *I am not a substitute for professional medical advice. Always consult a nurse for proper diagnosis.*`
  }

  if (lower.includes('appointment') || lower.includes('book')) {
    return `To book an appointment, go to the **Appointments** section in your portal and select an available slot.\n\nIf you need urgent help, please visit the clinic directly.`
  }

  if (lower.includes('emergency') || lower.includes('urgent')) {
    return `🚨 **If this is a medical emergency, please go to the clinic immediately or call emergency services.**\n\nFor non-urgent concerns, you can book an appointment or message a nurse through the portal.`
  }

  return `I'm not sure about that specific symptom. Here are topics I can help with:\n\n• Headache • Fever • Cough • Sore throat\n• Stomach pain • Diarrhoea • Dizziness • Rash\n• Fatigue • Back pain • Chest pain • Anxiety\n• Eye irritation • Menstrual pain\n\n⚠️ *For anything not listed, please book an appointment or message a nurse.*`
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const payload = verifyToken(token || '')
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { message } = await request.json()
    if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

    const reply = getResponse(message)
    return NextResponse.json({ reply })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
  }
}
