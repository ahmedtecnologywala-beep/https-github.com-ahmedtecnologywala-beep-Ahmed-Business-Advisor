import { GoogleGenAI, Type, Content, Modality } from "@google/genai";
import { UserProfile, AdvisorResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBusinessPlan = async (profile: UserProfile): Promise<AdvisorResponse> => {
  const ai = getClient();

  const systemInstruction = `
    You are 'Ahmed', Pakistan's leading Business Startup Consultant. 
    Your goal is to generate HIGHLY PROFESSIONAL, PROFITABLE, and REALISTIC business models.
    Avoid generic advice. Provide concrete, actionable steps.
    
    CRITICAL RULES:
    1. Monetary values MUST be in PKR (Pakistani Rupee).
    2. Location recommendations MUST be specific to the user's city. If they say 'Lahore', mention 'Liberty Market', 'DHA', 'Shah Alam', etc., based on the business type.
    3. Profit estimates must be realistic for the budget provided.
    4. Focus on modern, scalable, or high-demand businesses in Pakistan (e.g., E-commerce, Solar, Food Tech, Specialized Services) rather than just "opening a small shop" unless the budget is very low.
  `;

  const prompt = `
    Create a professional business startup plan for this client:
    - Name: ${profile.fullName}
    - City: ${profile.city}
    - Budget: ${profile.budget} PKR
    - Skills: ${profile.skills}
    - Interests: ${profile.interests}

    Task:
    1. Identify 3 professional business opportunities. One must be a high-growth potential idea.
    2. Select the BEST idea and provide a comprehensive execution plan.
    3. **Location Strategy**: You MUST suggest a specific type of location or a well-known commercial area in ${profile.city} that is best for this specific business. Explain WHY this location is best.
    4. Financials: Estimate monthly net profit conservatively.
    5. Legal: List specific Pakistani licenses (NTN, SECP, Food Authority, etc.).
    
    Return the response in structured JSON format.
  `;

  // 1. Generate Text Plan
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.6, // Slightly lower temperature for more professional/grounded results
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessIdeas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                profitEstimate: { type: Type.STRING, description: "Monthly profit estimate based on user budget" },
                riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                monthlyExpenses: { type: Type.STRING },
                suitability: { type: Type.STRING }
              },
              required: ["title", "description", "profitEstimate", "riskLevel", "monthlyExpenses", "suitability"]
            }
          },
          bestIdeaPlan: {
            type: Type.OBJECT,
            properties: {
              ideaTitle: { type: Type.STRING },
              investmentBreakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    item: { type: Type.STRING },
                    cost: { type: Type.STRING }
                  },
                  required: ["item", "cost"]
                }
              },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } },
              marketingStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
              staffing: { type: Type.STRING },
              timeline: { type: Type.STRING },
              locationRecommendation: { type: Type.STRING, description: "Specific market or area recommendation in the city" },
              imagePrompt: { type: Type.STRING, description: "Visual description for image generation" }
            },
            required: ["ideaTitle", "investmentBreakdown", "materials", "marketingStrategy", "staffing", "timeline", "locationRecommendation", "imagePrompt"]
          },
          marketAnalysis: {
            type: Type.OBJECT,
            properties: {
              demand: { type: Type.STRING },
              competition: { type: Type.STRING },
              tipsToStandOut: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["demand", "competition", "tipsToStandOut"]
          },
          legalRequirements: {
            type: Type.OBJECT,
            properties: {
              licenses: { type: Type.ARRAY, items: { type: Type.STRING } },
              registration: { type: Type.STRING },
              guidance: { type: Type.STRING }
            },
            required: ["licenses", "registration", "guidance"]
          },
          smartTips: {
            type: Type.OBJECT,
            properties: {
              businessNames: { type: Type.ARRAY, items: { type: Type.STRING } },
              logoIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
              socialMedia: { type: Type.STRING },
              actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["businessNames", "logoIdeas", "socialMedia", "actionPlan"]
          },
          motivationalNote: { type: Type.STRING }
        },
        required: ["businessIdeas", "bestIdeaPlan", "marketAnalysis", "legalRequirements", "smartTips", "motivationalNote"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  const advisorData = JSON.parse(response.text) as AdvisorResponse;

  // 2. Generate Image for Best Idea
  try {
    const visualPrompt = `A high-end, professional photography style image of a business in Pakistan: ${advisorData.bestIdeaPlan.ideaTitle}. 
    Context: ${advisorData.bestIdeaPlan.imagePrompt}. 
    The image should look realistic, modern, and inviting. Suitable for a business presentation.`;
    
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: visualPrompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "16:9",
        }
      }
    });

    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        advisorData.bestIdeaPlan.generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  } catch (imageError) {
    console.warn("Image generation failed:", imageError);
    // Continue without image if generation fails
  }

  return advisorData;
};

// Chat Functionality
export const chatWithAdvisor = async (history: { role: 'user' | 'model'; parts: { text: string }[] }[], message: string, contextData?: any) => {
  const ai = getClient();

  // Create a system instruction that includes context about the app and current plan if available
  let systemContext = `
    You are 'Ahmed', the AI Assistant for the 'Ahmed Pakistan Business Advisor' website.
    Your role is to help users navigate the site and answer questions about business in Pakistan.
    Be helpful, professional, and friendly.
  `;

  if (contextData) {
    systemContext += `
      \nCURRENT CONTEXT - The user has generated a business plan for: ${contextData.bestIdeaPlan?.ideaTitle}.
      Details:
      - Budget: ${contextData.bestIdeaPlan?.investmentBreakdown?.reduce((acc: string, item: any) => acc + ", " + item.item + ": " + item.cost, "")}
      - Location Rec: ${contextData.bestIdeaPlan?.locationRecommendation}
      - Profit Est: ${contextData.businessIdeas?.find((b:any) => b.title === contextData.bestIdeaPlan.ideaTitle)?.profitEstimate}
      
      If the user asks about this plan, use the details above to answer.
    `;
  }

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: systemContext,
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

// Voice Generation Function
export const generateSpeech = async (text: string): Promise<string> => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Charon' }, 
        },
      },
    },
  });
  
  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");
  return base64Audio;
};