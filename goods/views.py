from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import os
import openai
import json
import replicate
import random
import string
from io import BytesIO
import requests

import base64
import json
from PIL import Image, PngImagePlugin

# Create your views here.
openai.api_key = "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"
# openai.api_key = "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"
messageList = []


def UI_mindmap(request):
    # render(request, "UI_mindmap.html")

    if request.method == 'POST':
        designID = request.POST['designID']

        # 输入design problem 输出Requirements
        if designID == '5W1H':
            prompt = request.POST['message']
            response = get_completion_from_messages(
                generate_requirements_prompt(prompt))
            # print(response)
            # print(type(response)) # <class 'dict'>
            return JsonResponse(response)
            # return render(request, "UI_mindmap.html")

         # 输入Requirements 输出Function
        elif designID == 'Requirements':
            prompt = request.POST['requirements']
            print(prompt)
            response = get_completion_from_messages(
                generate_functions_prompt(prompt))
            print('Return 5W1H', response)
            return JsonResponse(response)

        # 输入Function 输出Behaviors
        elif designID == 'Functions':
            prompt = request.POST['functions']
            print(prompt)
            response = get_completion_from_messages(
                generate_behaviors_prompt(prompt))
            print('Return Functions', response)
            # print(type(response)) # <class 'dict'>
            return JsonResponse(response)

        # 输入Behaviors 输出sructures
        elif designID == 'Behaviors':
            prompt = request.POST['behaviors']
            print(prompt)
            response = get_completion_from_messages(
                generate_structures_prompt(prompt))
            print('Return Behaviors', response)
            # print(type(response)) # <class 'dict'>
            return JsonResponse(response)

        # 输入Kansei 输出外观设计
        elif designID == 'Kansei':
            kanseiN = request.POST['kansei_n']
            kanseiA = request.POST['kansei_a']
            print(kanseiN)
            print(kanseiA)
            response = get_completion_from_messages(
                generate_kansei(kanseiN, kanseiA))
            print('Return Kansei', response)
            # print(type(response)) # <class 'dict'>
            return JsonResponse(response)

        # elif designID == 'Image':
        #     prompt = request.POST['image']
        #     imgList = generate_img(prompt)
        #     return JsonResponse(imgList, safe=False)

        # reload signleNode
        else:
            print(designID)
            response = get_completion_from_messages(
                generate_reload_node(designID))
            print('Return reload', response)
            # print(type(response)) # <class 'dict'>
            return JsonResponse(response)

        # reload signleNode
        else:
            print(designID)
            response = get_completion_from_messages(
                generate_reload_node(designID))
            print('Return reload', response)
            # print(type(response)) # <class 'dict'>
            return JsonResponse(response)

    return render(request, "UI_mindmap.html")


def get_completion(prompt, model="gpt-4"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0.7,  # this is the degree of randomness of the model's output
    )
    print(response)
    response = string2json(response.choices[0].message["content"])
    return response


def get_completion_from_messages(messages, model="gpt-4", temperature=0.7):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature,  # 控制模型输出的随机程度
    )
#   print(str(response.choices[0].message))

    print(response.choices[0].message["content"])
    response = string2json(response.choices[0].message["content"])
    return response


def string2json(data_string):
    try:
        # 使用 json.loads 转换字符串为 JSON 格式
        data_json = json.loads(data_string)
        return data_json
    except json.JSONDecodeError:
        response = reloadJson()
        string2json(response)


def generate_requirements_prompt(design):
    messageList.append({'role': 'system',
                       'content': 'you act as a designer and work with me on a product design task.In the design process,\
                        you need to complete the structure design of the product according to FBS (Function-Behavior-Structure) strategy \
                        and the appearance design based on kansei engineering. you need to respond only as this designer. Do not write all the conversation at once. Please wait for the questions and give the answer.\
                        Only provide the JSON output and do not include any unnecessary words.\
                        Only just need an output in pure JSON format. No explanations, comments or additional text is needed. Please follow this format strictly.'})

    prompt = f"""
         Answer the following six questions according to the design problem:
            1 - Who will use this product?
            2 - What will the user do with this product?
            3 - When will this product be used?
            4 - Why do users use this product?
            5 - Where will this product be used?
            6 - How will this product be used?

        Design problem given by triple backticks :
        ```{design}``` \

        Output JSON: <json with who/what/when/why/where/how and Answer>\
        Only provide the JSON output and do not include any unnecessary words.\

        """

    messageList.append({'role': 'user', 'content': prompt})

    # print(prompt)
    return messageList


def generate_functions_prompt(design):
    prompt = f"""
        Product design requirement given by triple backticks:
            ```{design}```
        What functions does the product need to have in order to meet these requirements? \

        I would like to receive a JSON format output, where each entry has a key as a brief name of the function, and the value is a detailed description of that function. For example: "Brief Name": "Function Description". \
        Only provide the JSON output and do not include any unnecessary words.

        """
    messageList.append({'role': 'user', 'content': prompt})
    return messageList


def generate_behaviors_prompt(design):
    prompt = f"""
        Functions of the product given by triple backticks:
            ```{design}```

        What behaviors should the product implement to enable the above functions? Use the FBS model to reason about all behaviors, focusing solely on behaviors, not structures.

        I would like to receive a JSON format output. I expect the output in the following JSON format:
        {{
            "Function_Name": {{
                "key(Using Phrase Summary the value)": "value(brief description of behavior)",
                "key(Using Phrase Summary the value)": "value(brief description of behavior)",
                ...
            }},
            Function_Name": {{
                "key(Using Phrase Summary Values)": "value(brief description of behavior)",
                ...
            }},
            ...
        }}
        Provide only the JSON output and omit any extraneous content.
        """
    messageList.append({'role': 'user', 'content': prompt})
    return messageList


def generate_structures_prompt(design):
    prompt = f"""
        Behaviors that the product needs to achieve given by triple backticks:
            ```{design}```

        What structures can achieve the above behaviors? Please Use the FBS model to reason the substructures of this product.\

        I would like to receive a JSON format output. I expect the output in the following JSON format:\
        {{
            "Behavior_Name": {{
                "structures_Name": "Corresponding Detailed structures Description",
            }},
            "Behavior_Name": {{
                "structures_Name": "Corresponding Detailed structures Description",
                "structures_Name": "Corresponding Detailed structures Description",
                ...
            }},
            ...
        }}
        Only provide the JSON output and do not include any unnecessary words.\
        Only provide the JSON output and do not include any unnecessary words.\
        I just need an output in pure JSON format. No explanations, comments or additional text is needed. Please follow this format strictly.\
        """

    messageList.append({'role': 'user', 'content': prompt})
    return messageList


def generate_kansei(nouns, adjectives):

    prompt = f"""
        Please provide a specific appearance design scheme based on Kansei engineering in terms of shape, color and texture,
        ensuring that the elements of ```{nouns}``` are incorporated and ```{adjectives}``` emotions are conveyed.

         I would like to receive a JSON format output. I expect the output in the following JSON format:
        {{
            "Shape": {{
                "key(Using Phrase Summary Values)": "value( description)",
                "key(Using Phrase Summary Values)": "value(description)",
                "key(Using Phrase Summary Values)": "value(description)",
                ...
            }},
            "Color": {{
               "key(Using Phrase Summary Values)": "value(description)",
                "key(Using Phrase Summary Values)": "value(description)",
                "key(Using Phrase Summary Values)": "value(description)",
                ...
            }},
            "Texture": {{
                 "key(Using Phrase Summary Values)": "value(description)",
                 "key(Using Phrase Summary Values)": "value(description)",
                 "key(Using Phrase Summary Values)": "value(description)",
                ...
            }}

        }}
        
        Only provide the JSON output and do not include any unnecessary words.
        """

    messageList.append({'role': 'user', 'content': prompt})
    return messageList


def generate_img(design):
    static_file_path_list = []
    default_client = replicate.Client(
        api_token='r8_AlA4KaZYJzBhZNCpdtHPuvDQ4BI4NIv16OzX5')

    for i in range(4):
        output = default_client.run(
            "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
            input={"prompt": design}
        )
        # 生成随机的9位字符串
        random_string = ''.join(random.choices(
            string.ascii_letters + string.digits, k=9))

        file_name = f'goods/static/img/output/{random_string}.png'
        static_file_path = f'img/output/{random_string}.png'
        static_file_path_list.append(static_file_path)
        print(static_file_path_list)

        response = requests.get(output[0])
        img = Image.open(BytesIO(response.content))
        img.save(file_name)

    return static_file_path_list


def reloadJson():
    messageList.append(
        {'role': 'user', 'content': 'I just need an output in pure JSON format and dictionary type. No explanations, comments or additional text is needed. Please follow this format strictly.'})

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messageList,
        temperature=0.7,  # 控制模型输出的随机程度
    )
#   print(str(response.choices[0].message))

    print(response.choices[0].message["content"])
    return response.choices[0].message["content"]


def generate_reload_node(design):
    result_str = remove_prefix_from_string(design)
    print('————————————————————————————————————————————————————————————')
    print('reload', result_str)
    prompt = f"""
        Please add one new ```{result_str}```to the existing list of ```{result_str}```, and output only the new ```{result_str}``` in JSON format.
        
        I would like to receive a JSON format output. I expect the output in the following JSON format:
        {{ "key(Using Phrase Summary the value)": "value(brief description of behavior)"}},\

        Only provide the JSON output and do not include any unnecessary words.\
        I just need an output in pure JSON format. No explanations, comments or additional text is needed. Please follow this format strictly.\
        """

    messageList.append({'role': 'user', 'content': prompt})
    return messageList


def generate_prompt_test(design):
    animal = 'cat'
    return """Suggest three names for an animal that is a superhero.

        Animal: Cat
        Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
        Animal: Dog
        Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
        Animal: {}
        Names:""".format(
        animal.capitalize()
    )


def remove_prefix_from_string(s):
    return s[6:]
