import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();
        const { base64Image } = body;

        if (!base64Image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            );
        }

        // Validate that OpenAI API key exists
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        // Create the safety analysis prompt
        const prompt = `
You are a workplace safety expert analyzing a photo for potential safety risks. Please analyze this image and identify any safety hazards, violations, or risks present.

For each risk you identify, provide:
1. A clear title describing the risk
2. A risk level: "low", "medium", or "high"
3. A specific recommendation to address the risk

Format your response as a JSON object with this structure:
{
  "risks": [
    {
      "title": "Description of the risk",
      "level": "low|medium|high",
      "recommendation": "Specific action to take"
    }
  ]
}

Focus on identifying risks related to:
- Personal protective equipment (PPE) usage
- Equipment safety and maintenance
- Environmental hazards
- Ergonomics and posture
- Fire safety
- Electrical safety
- Chemical safety
- Fall protection
- General workplace organization and cleanliness

If no significant risks are found, respond with an empty risks array.
`;

        // Call OpenAI Vision API
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: base64Image,
                                detail: "high"
                            },
                        },
                    ],
                },
            ],
            max_tokens: 1000,
            temperature: 0.1, // Low temperature for consistent analysis
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            return NextResponse.json(
                { error: 'No response from AI model' },
                { status: 500 }
            );
        }

        // Parse the AI response
        let analysisResult;
        try {
            // Extract JSON from response (in case there's extra text)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : content;
            analysisResult = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            return NextResponse.json(
                { error: 'Failed to parse AI response' },
                { status: 500 }
            );
        }

        // Validate the response structure
        if (!analysisResult.risks || !Array.isArray(analysisResult.risks)) {
            return NextResponse.json(
                { error: 'Invalid response format from AI' },
                { status: 500 }
            );
        }

        // Define interface for raw risk data from AI
        interface RawRisk {
            title?: string;
            level?: string;
            recommendation?: string;
        }

        // Validate each risk object
        const validatedRisks = analysisResult.risks
            .filter((risk: RawRisk) =>
                risk.title &&
                risk.level &&
                risk.recommendation &&
                ['low', 'medium', 'high'].includes(risk.level)
            )
            .map((risk: RawRisk) => ({
                title: String(risk.title).trim(),
                level: risk.level as 'low' | 'medium' | 'high',
                recommendation: String(risk.recommendation).trim(),
            }));

        return NextResponse.json({
            risks: validatedRisks,
        });

    } catch (error) {
        console.error('Error in analyze API:', error);

        // Handle OpenAI specific errors
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { error: 'Invalid API key' },
                    { status: 401 }
                );
            }
            if (error.message.includes('quota')) {
                return NextResponse.json(
                    { error: 'API quota exceeded' },
                    { status: 429 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Internal server error during analysis' },
            { status: 500 }
        );
    }
}
