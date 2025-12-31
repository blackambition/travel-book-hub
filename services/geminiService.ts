
import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary, TripInputs } from "../types";

export const generateItinerary = async (inputs: TripInputs): Promise<Itinerary> => {
  // Creating a new instance right before the call as per instructions for dynamic key management.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Destination: ${inputs.destination}
    Dates: ${inputs.startDate} to ${inputs.endDate}
    Traveler Profile: ${inputs.travelerType}
    Pace: ${inputs.pace}
    Interests: ${inputs.interests.join(', ')}
    Budget: ${inputs.budget}
    Travel Style: ${inputs.travelStyle}
    Base Hotel: ${inputs.hotelLocation || 'Not specified'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: `You are an inclusive travel refactoring engine. 
        Your goal is to create itineraries that work for ANY walk of life, specifically focusing on the user's "Traveler Profile".
        
        CORE PRINCIPLES:
        1. Accessibility: If the profile mentions mobility, prioritize wheelchair-accessible venues and flat paths.
        2. Life-Stage Appropriate: Families with kids need frequent breaks and kid-friendly food. Seniors need comfortable transport and fewer stairs.
        3. Budget-Inclusive: Respect the budget strictly. Shoestring means free parks/street food; Luxury means private tours.
        4. Pace Control: Honor the "Leisurely" vs "Intense" pace.
        
        Output strictly valid JSON that strictly follows the provided schema. Do not include markdown code blocks.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trip_name: { type: Type.STRING },
            destination: { type: Type.STRING },
            inclusivity_summary: { type: Type.STRING, description: "How this trip specifically accommodates the traveler profile." },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day_number: { type: Type.INTEGER },
                  date: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        activity: { type: Type.STRING },
                        location: { type: Type.STRING },
                        description: { type: Type.STRING },
                        cost_estimate: { type: Type.STRING },
                        reservation_flag: { type: Type.BOOLEAN },
                        duration_mins: { type: Type.INTEGER },
                        accessibility_note: { type: Type.STRING },
                        tech_feature: { type: Type.STRING },
                        efficiency_note: { type: Type.STRING },
                        suitability_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        provider: { type: Type.STRING }
                      },
                      required: ["time", "activity", "location", "description", "cost_estimate", "reservation_flag", "duration_mins", "accessibility_note", "suitability_tags"]
                    }
                  }
                },
                required: ["day_number", "summary", "activities"]
              }
            },
            tech_travel_tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["trip_name", "destination", "days", "inclusivity_summary"]
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI.");
    
    // Clean up potential markdown if it slipped through despite instructions
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);
    
    return {
      ...data,
      id: `trip_${Math.random().toString(36).substr(2, 9)}`,
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("API_KEY_MISSING");
    }
    throw new Error(error.message || "Failed to generate itinerary. Please try again.");
  }
};
