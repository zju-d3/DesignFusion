import os
import openai

# openai.api_key = os.getenv(
#     "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")
# openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = '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'
# 该辅助函数将使使用提示和查看生成的输出结果变得更容易：


def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0,  # this is the degree of randomness of the model's output
    )
    print(response)
    return response.choices[0].message["content"]


if __name__ == '__main__':
    print("111111")
    text = "a lounge chair intended for domestic use that needs to be appealing and attract the user to sit and relax"


    prompt = f"""
        I want you to act as a designer and work with me on a product design task. \
        In the design process, you need to complete the structure design of the product according to FBS (Function-Behavior-Structure) strategy and the appearance design based on kansei engineering. \
        I want you to respond only as this designer. Do not write all the conversation at once. Please wait for my questions and give me the answer. \
        
        Design problem given by triple backticks : \
        ```{text}```
        Please answer the following six questions according to the above design problem: \
            1. Who will use this product? \
            2. What will the user do with this product? \
            3. When will this product be used? \
            4. Why do users use this product? \
            5. Where will this product be used? \
            6. How will this product be used?

    """
    response = get_completion(prompt)
    print(response)
