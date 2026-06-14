import React, { useEffect, useState } from "react";
import { BookOpen, Lightbulb, Shield, Search, Target, BarChart3, Feather, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

// --- Configuration ---
const API_BASE_URL = import.meta.env.VITE_FIREBASE_API_BASE_URL; 

export default function Learn() {
  const [activeTab, setActiveTab] = useState("tips");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getChallenge = async () => {
      setIsLoading(true);
      try{
        const response = await fetch(`${API_BASE_URL}/learn/items`)
        if(!response.ok){
          throw new Error(`ไม่สามารถดึงข้อมูลโจทย์ได้ (HTTP ${response.status})`);
        }
        const data = await response.json();
        if(!data || data.length === 0) throw new Error("ไม่พบโจทย์สำหรับวันนี้");
        setData(data);
      }catch(e){
        throw new Error(e.message);
      }finally{
        setIsLoading(false);
      }
    }
    getChallenge()
  },[])

  const tabs = [
    { id: "tips", label: "เทคนิคการตรวจสอบ", icon: Lightbulb },
    { id: "examples", label: "ตัวอย่างจริง", icon: BookOpen },
    { id: "resources", label: "แหล่งข้อมูล", icon: Shield }
  ];

  const tips = [
    {
      icon: Search,
      title: "ตรวจสอบแหล่งข่าว",
      description: "ดูที่มาของข่าวและความน่าเชื่อถือของเว็บไซต์",
      details: [
        "ตรวจสอบชื่อเว็บไซต์และโดเมน",
        "ดูประวัติของแหล่งข่าว",
        "เช็คว่าเป็นเว็บไซต์ที่ได้รับการยอมรับหรือไม่"
      ]
    },
    {
      icon: Feather,
      title: "สังเกตการใช้ภาษา (Language)",
      description: "ข่าวปลอมมักใช้ภาษาที่กระตุ้นอารมณ์ ไม่เป็นกลาง",
      details: [
        "มีคำพาดหัวแบบ Clickbait หรือไม่? (เช่น ด่วน! ช็อก! เหลือเชื่อ!)",
        "ใช้คำที่ดูเกินจริง หรือรับประกันผล 100% หรือไม่?",
        "มีคำผิด สะกดผิด หรือใช้ไวยากรณ์แปลกๆ หรือไม่?"
      ]
    },
    {
      icon: BarChart3,
      title: "วิเคราะห์ตัวเลขและสถิติ",
      description: "ตรวจสอบความสมเหตุสมผลของข้อมูลตัวเลข",
      details: [
        "ตัวเลขมีความเป็นไปได้หรือไม่",
        "มีการเปรียบเทียบกับข้อมูลอื่นหรือไม่",
        "มีแหล่งที่มาของสถิติหรือไม่"
      ]
    },
    {
      icon: Target,
      title: "วิเคราะห์น้ำเสียงและวัตถุประสงค์ (Tone & Purpose)",
      description: "พยายามจับให้ได้ว่าข่าวต้องการ 'บอกเล่า' หรือ 'ชี้นำ'",
      details: [
        "น้ำเสียงของข่าวเป็นกลาง หรือพยายามสร้างความเกลียดชัง/ความกลัว?",
        "ข่าวนี้มีเจตนาเพื่อให้ข้อมูล หรือเพื่อขายของ/โฆษณาชวนเชื่อ?",
        "มีการให้ข้อมูลครบทุกด้าน หรือเลือกเสนอแค่ด้านเดียว?"
      ]
    }
  ];

  const examples = [
    {
      title: "ข่าวปลอม: การแพทย์",
      content: "นักวิทยาศาสตร์พบยารักษาโรคมะเร็ง 100% จากการทดลองกับผู้ป่วย 50 คน",
      isFake: true,
      analysis: [
        "ตัวเลข 100% ดูเกินจริง",
        "การทดลองกับผู้ป่วยเพียง 50 คนน้อยเกินไป",
        "ไม่มีการอ้างอิงงานวิจัยหรือสถาบันที่ชัดเจน"
      ]
    },
    {
      title: "ข่าวจริง: เทคโนโลยี",
      content: "Apple ประกาศเปิดตัว iPhone 15 พร้อมฟีเจอร์ใหม่ ตามที่ CEO Tim Cook เปิดเผยในการประชุมผู้ถือหุ้นประจำปี",
      isFake: false,
      analysis: [
        "มีการอ้างอิงบุคคลที่มีชื่อเสียง",
        "เหตุการณ์เป็นไปได้และสมเหตุสมผล",
        "มีบริบทเวลาและสถานที่ที่ชัดเจน"
      ]
    }
  ];

  const resources = [
    {
      title: "FactCheck.org",
      description: "เว็บไซต์ตรวจสอบข่าวปลอมระดับนานาชาติ",
      url: "https://factcheck.org",
      category: "International"
    },
    {
      title: "Thai Fact Check",
      description: "ศูนย์ตรวจสอบข่าวปลอมภาษาไทย",
      url: "https://thai-factcheck.com",
      category: "Thai"
    },
    {
      title: "Snopes",
      description: "ฐานข้อมูลตรวจสอบข่าวลือและข่าวปลอม",
      url: "https://snopes.com",
      category: "International"
    }
    ,{
      title: "โดย อสมท. ร่วมกับหน่วยงานต่างๆ",
      description: "ชัวร์ก่อนแชร์",
      url: "https://www.sure.moph.go.th/",
      category: "Thai"
    }
  ];

  const renderTips = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">5 ขั้นตอนการตรวจสอบข่าว</h2>
        <p className="text-lg text-gray-600">เรียนรู้เทคนิคที่ช่วยให้คุณแยกแยะข่าวจริง-ปลอมได้อย่างมีประสิทธิภาพ</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {tips.map((tip, index) => {
          const IconComponent = tip.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {tip.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* 5-Step Process */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">กระบวนการตรวจสอบ 5 ขั้นตอน</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { step: 1, title: "หยุดคิดและตั้งสติ", desc: "ก่อนจะเชื่อหรือแชร์ ลองหายใจลึกๆ อย่าเพิ่งรีบตัดสินใจจากพาดหัวข่าว" },
            { step: 2, title: "ตรวจสอบแหล่งข่าว", desc: "ข่าวนี้มาจากใคร? แหล่งข่าวนี้น่าเชื่อถือหรือไม่? มีประวัติอย่างไร?" },
            { step: 3, title: "หาหลักฐานสนับสนุน", desc: "มีสำนักข่าวที่น่าเชื่อถืออื่นๆ รายงานเรื่องเดียวกันนี้หรือไม่?" },
            { step: 4, title: "สังเกตสัญญาณเตือน", desc: "มองหาการใช้ภาษาที่กระตุ้นอารมณ์, ภาพที่ดูผิดปกติ, หรือการอ้างที่ไม่มีที่มา" },
            { step: 5, title: "ปรึกษาผู้เชี่ยวชาญ", desc: "หากไม่แน่ใจ ลองใช้เว็บไซต์ตรวจสอบข่าว หรือถามผู้ที่มีความรู้ในเรื่องนั้นๆ" }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="font-bold">{item.step}</span>
              </div>
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm opacity-90">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExamples = () => (
<div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">ตัวอย่างจริง</h2>
        <p className="text-lg text-gray-600">เรียนรู้จากการวิเคราะห์ข่าวจริงและปลอม</p>
      </div>

      <div className="space-y-8">
        {data.map((example, index) => {
          // ตรวจสอบว่าเป็นข่าวปลอมหรือไม่โดยดูจากค่า label (0 = ปลอม, 1 = จริง)
          const isFake = example.label === 0;

          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* ส่วนหัวข้อและป้ายกำกับ (Header) */}
              <div className={`p-6 ${isFake ? 'bg-red-50 border-l-4 border-red-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
                <div className="flex items-center space-x-3 mb-2">
                  {isFake ? (
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{example.title}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isFake
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {isFake ? 'ข่าวปลอม' : 'ข่าวจริง'}
                  </span>
                  <span className="text-sm text-gray-500">ที่มา: {example.domain}</span>
                </div>
              </div>

              {/* ส่วนเนื้อหาและการวิเคราะห์ */}
              <div className="p-6">
                {/* เนื้อหาข่าว */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-base leading-relaxed text-gray-800">"{example.text}"</p>
                </div>

                {/* การวิเคราะห์ของ AI */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">🧠 การวิเคราะห์โดย AI:</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-gray-700">{example.ai_reasoning}</p>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-900 mb-3">🔑 คำสำคัญที่พบ:</h4>
                   <ul className="space-y-2">
                    {example.clue_words_analysis.map((clue, clueIndex) => (
                      <li key={clueIndex} className="flex items-start space-x-3">
                        <ArrowRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          <span className="font-semibold">{clue.word}:</span> {clue.analysis}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">แหล่งข้อมูลที่น่าเชื่อถือ</h2>
        <p className="text-lg text-gray-600">เว็บไซต์และเครื่องมือที่ช่วยในการตรวจสอบข่าว</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                resource.category === 'Thai' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {resource.category}
              </span>
            </div>
            
            <a 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <span>เยี่ยมชมเว็บไซต์</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ))}
      </div>

      {/* Additional Tips */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">เคล็ดลับเพิ่มเติม</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold mb-3">เครื่องมือตรวจสอบ</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• Google Reverse Image Search</li>
              <li>• Wayback Machine</li>
              <li>• WHOIS Lookup</li>
              <li>• Social Media Verification Tools</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">สัญญาณเตือน</h4>
            <ul className="space-y-2 text-blue-100">
              <li>• ตัวเลขที่เกินจริง</li>
              <li>• ไม่มีแหล่งที่มาชัดเจน</li>
              <li>• ใช้คำที่ดราม่าเกินไป</li>
              <li>• ขอให้แชร์ทันที</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-8 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="h-4 w-4" />
            <span>Learning Center</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">เรียนรู้การตรวจสอบข่าว</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            พัฒนาทักษะการคิดเชิงวิพากษ์และเรียนรู้เทคนิคการแยกแยะข่าวจริง-ปลอม
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === "tips" && renderTips()}
          {activeTab === "examples" && renderExamples()}
          {activeTab === "resources" && renderResources()}
        </div>
      </div>
    </div>
  );
}