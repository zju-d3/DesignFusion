
import replicate
import requests

from PIL import Image
from io import BytesIO


def main():
    default_client = replicate.Client(
        api_token='r8_7XJFtAPvX80YGQshB7D3BCJtVSCdCVu4ZajqN')

    output = default_client.run(
        "stability-ai/stable-diffusion:27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bcd7478",
        input={"prompt": "a cat drawwing a picture"}
    )

    response = requests.get(output[0])
    img = Image.open(BytesIO(response.content))
    img.save('downloaded_image.png')


if __name__ == '__main__':
    main()
