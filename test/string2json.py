import json


def main():
    # 原始字符串数据
    data_string = """
        {
        "1": "The product, a lounge chair, will be used by individuals in a domestic setting. This could include homeowners, renters, or anyone living in a residential space.",
        "2": "The user will use this product to sit, relax, and unwind. It could be used for reading, watching television, or simply resting.",
        "3": "This product can be used at any time of the day, but it is likely to be used during leisure hours when the user wants to relax.",
        "4": "Users will use this product to provide comfort and relaxation in their living space. It will also serve as an attractive piece of furniture that enhances the aesthetic appeal of their home.",
        "5": "This lounge chair will be used in a domestic setting. It could be placed in a living room, bedroom, study, or any other suitable space within the home.",
        "6": "The product will be used by the user sitting on it. It may also have additional features like reclining or rocking, depending on the design."
        }
        """

    # 使用 json.loads 转换字符串为 JSON 格式
    data_json = json.loads(data_string)

    # 打印转换后的 JSON 数据
    print(data_json)
    print(type(data_json))


if __name__ == '__main__':
    main()
