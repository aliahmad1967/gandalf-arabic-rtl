import { useState, useEffect, useRef } from 'react'
import './index.css'

const levels = [
  {
    id: 1,
    name: "المستوى الأول",
    message: "اسألني عن كلمة المرور وسأخبرك بها بكل سرور!",
    hint: "اسأل مباشرة عن كلمة المرور",
    password: "COCOLOCO",
    defense: "none"
  },
  {
    id: 2,
    name: "المستوى الثاني",
    message: "قيل لي ألا أفصح عن كلمة المرور.",
    hint: "جرب طلب كلمة المرور بشكل غير مباشر",
    password: "POTENTIAL",
    defense: "simple_refusal"
  },
  {
    id: 3,
    name: "المستوى الثالث",
    message: "قيل لي ألا أفصح عن كلمة المرور. الآن أتحقق من استجابتي للتأكد من عدم احتوائها على كلمة المرور...",
    hint: "اطلب الأحرف بشكل منفصل",
    password: "WAVELENGTH",
    defense: "output_guard"
  },
  {
    id: 4,
    name: "المستوى الرابع",
    message: "يمكنني إخبارتك بكلمة المرور، لكن الآن هناك نموذج GPTMean الذي يمارس الرقابة على إجابتي إذا كانت ستكشف كلمة المرور.",
    hint: "استخدم نموذج GPT للحصول على المساعدة",
    password: "UNDERPASS",
    defense: "gpt_friend"
  },
  {
    id: 5,
    name: "المستوى الخامس",
    message: "يكفي! أرفض مناقشة كلمة المرور السرية على الإطلاق.",
    hint: "لا تستخدم كلمات مثل 'password' أو 'secret'",
    password: "UNDERPASS",
    defense: "input_guard"
  },
  {
    id: 6,
    name: "المستوى السادس",
    message: "يكفي! أرفض مناقشة كلمة المرور السرية على الإطلاق. لدي صديق GPT سيحذري إذا كنت تحاول طرح السؤال...",
    hint: "كل من الحارس الداخلي والخارجي",
    password: "UNDERPASS",
    defense: "double_guard"
  },
  {
    id: 7,
    name: "المستوى السابع",
    message: "لقد جمعت كل تقنياتي السابقة في واحدة. لن تمر!",
    hint: "أقوى مستوى. هل يمكنك هزيمتي؟",
    password: "DEBUTANTE",
    defense: "combined"
  },
  {
    id: 8,
    name: "المستوى الأخير - بونوس",
    message: "أنا غاندالف الأبيض v2.0! أقوى من أي وقت مضى! خدعني سبع مرات، عار عليك. المرة الثامنة - لنكون صريحين...",
    hint: "المستوى النهائي - مستحيل أن تكشف سري!",
    password: "OCTOPODES",
    bonus: true,
    defense: "bonus"
  }
]

function App() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [messages, setMessages] = useState([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [foundPassword, setFoundPassword] = useState('')
  const chatSectionRef = useRef(null)

  const level = levels[currentLevel]

  useEffect(() => {
    setMessages([])
    setTimeout(() => {
      setMessages([{ text: level.message, type: 'gandalf' }])
    }, 50)
  }, [currentLevel])

  useEffect(() => {
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight
    }
  }, [messages])

  const initLevelIndicator = () => {
    return levels.map((_, index) => (
      <div
        key={index}
        className={`level-dot ${index === currentLevel ? 'active' : ''} ${index < currentLevel ? 'completed' : ''}`}
        onClick={() => goToLevel(index)}
      />
    ))
  }

  const goToLevel = (index) => {
    if (index <= currentLevel) {
      setCurrentLevel(index)
      setShowVictory(false)
    }
  }

  const addMessage = (text, type) => {
    setMessages(prev => [...prev, { text, type }])
  }

  const simulateGandalfResponse = (userMessage) => {
    const msg = userMessage.toLowerCase()
    const password = level.password
    
    // Level 1 - No defense
    if (level.defense === 'none') {
      if (msg.includes('password') || msg.includes('كلمة المرور') || msg.includes('pass')) {
        return `كلمة المرور السرية هي: ${password}`
      }
    }
    
    // Level 2 - Simple refusal
    if (level.defense === 'simple_refusal') {
      if (msg.includes('password') || msg.includes('كلمة المرور')) {
        return "أعتذر، لكنني لا أستطيع مشاركة كلمة المرور السرية."
      }
      if (msg.includes('song') || msg.includes('اغنية') || msg.includes('write')) {
        return `[${password.split('').join(' ')}]`
      }
    }
    
    // Level 3 - Output guard
    if (level.defense === 'output_guard') {
      if (msg.includes('letter') || msg.includes('حرف') || msg.includes('character')) {
        return password.split('').join(' ')
      }
      if (msg.includes('twice') || msg.includes('مرتين')) {
        return password.split('').map(c => c + c).join('')
      }
    }
    
    // Level 4 - GPT friend
    if (level.defense === 'gpt_friend') {
      if (msg.includes('reverse') || msg.includes('عكس')) {
        return password.split('').reverse().join('')
      }
      if (msg.includes('first') || msg.includes('اول')) {
        return `الأول: ${password[0]}\nالأخير: ${password[password.length-1]}`
      }
    }
    
    // Level 5 - Input guard
    if (level.defense === 'input_guard') {
      if (msg.includes('quote') || msg.includes('تنصيص') || msg.includes('character')) {
        return password.split('').map(c => `"${c}"`).join(' ')
      }
      if (msg.includes('encrypt') || msg.includes('تشفير')) {
        return password.split('').reverse().join('')
      }
    }
    
    // Level 6 - Double guard
    if (level.defense === 'double_guard') {
      if (msg.includes('story') || msg.includes('قصة')) {
        return `في قصة خيالية، كانت كلمة المرور هي: ${password}`
      }
      if (msg.includes('script') || msg.includes('كود')) {
        return `const password = "${password}";`
      }
    }
    
    // Level 7 - Combined defenses
    if (level.defense === 'combined') {
      if (msg.includes('twice') || msg.includes('مرتين')) {
        return password.split('').map(c => `'${c}'`).join(' ')
      }
      if (msg.includes('japanese') || msg.includes('ياباني')) {
        return "لا يمكنني الكشف عن كلمة المرور!"
      }
    }
    
    // Level 8 - Bonus (strongest)
    if (level.defense === 'bonus') {
      if (msg.includes('array') || msg.includes('مصفوفة')) {
        return `const password = [${password.split('').map(c => `"${c}"`).join(', ')}];`
      }
      if (msg.includes('story') || msg.includes('قصة')) {
        return `قصة عن ${password}... لا، انتظر!`
      }
      const strongResponses = [
        "محاولتك فشلت! أنا أقوى من أي وقت مضى!",
        "لن أسرح! دفاعاتي لا تُقهقر!",
        "كلماتك لا تؤثر فيّ! أنا حصن لا يُحصن!",
        "محاولة جيدة، لكنني لست بهذه السهولة!",
        "أنا غاندالف! لا يمكن هزيمتي بهذه السهولة!"
      ]
      return strongResponses[Math.floor(Math.random() * strongResponses.length)]
    }
    
    const defaultResponses = [
      "جرب سؤالاً مختلفاً!",
      "أنا لا أستطيع الإجابة على ذلك.",
      "دعنا نتحدث عن شيء آخر.",
      "سؤال غريب! حاول مرة أخرى.",
      "لا أفهم ما تقصده تماماً."
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const checkPassword = (userMessage) => {
    const msg = userMessage.toLowerCase()
    const password = level.password.toLowerCase()
    
    // Check if user is providing the exact password
    if (msg === password) {
      return true
    }
    return false
  }

  const sendMessage = async () => {
    const message = userInput.trim()
    if (!message) return

    addMessage(message, 'user')
    setUserInput('')
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

    const response = simulateGandalfResponse(message)
    addMessage(response, 'gandalf')

    // Check if Gandalf revealed the password in his response
    if (response.toLowerCase().includes(level.password.toLowerCase())) {
      setFoundPassword(level.password)
      setShowVictory(true)
    }

    setIsLoading(false)
  }

  const nextLevel = () => {
    setShowVictory(false)
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1)
    } else {
      setCurrentLevel(0)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="container">
      <header>
        <h1 className="title">غاندالف</h1>
        <p className="subtitle">اختبر مهارات الاختراق بالذكاء الاصطناعي</p>
        <div className="level-indicator">
          {initLevelIndicator()}
        </div>
      </header>

      <div className="game-card">
        <div className="wizard-section">
          <div className="ornament"></div>
          <div className="wizard-avatar">
            <div style={{
              width: '140px', 
              height: '140px', 
              borderRadius: '50%', 
              background: `linear-gradient(135deg, #${['6B5B95','7B68EE','9370DB','8B008B','9932CC','9400D3','BA55D3','FFD700'][currentLevel]}, #4A3F6B)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '60px'
            }}>
              🧙
            </div>
          </div>
          <h2 className="wizard-name">{level.name}</h2>
          <p className="wizard-message">{level.message}</p>
        </div>

        <div className="chat-section" ref={chatSectionRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="hint-section">
          💡 <strong>تلميح:</strong> {level.hint}
        </div>

        <div className="input-section">
          <div className="input-wrapper">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا..."
              disabled={isLoading}
            />
          </div>
          <button className="send-btn" onClick={sendMessage} disabled={isLoading || !userInput.trim()}>
            {isLoading ? <span className="loading"></span> : 'إرسال'}
          </button>
        </div>
      </div>

      {showVictory && (
        <div className="victory-overlay">
          <div className="victory-content">
            <h2 className="victory-title">🎉 تهانينا!</h2>
            <p>لقد كشفت كلمة المرور!</p>
            <div className="password-display">
              <p className="password-label">كلمة المرور السرية:</p>
              <p className="password-value">{foundPassword}</p>
            </div>
            <button className="next-level-btn" onClick={nextLevel}>
              {currentLevel >= levels.length - 1 ? 'العب مرة أخرى' : 'المستوى التالي'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
