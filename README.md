# Cloze generator

The application makes it possible to generate open-cloze tests based on the entered text. It uses the multi-objective ELECTRA model that was trained on own dataset. The model architecture which was the inspiration for the project was described by researchers from Cambridge in the paper: https://arxiv.org/pdf/2204.07237. My own paper about my research in this field is about to be published.

The app looks like this:
![image](https://github.com/user-attachments/assets/56a50d62-f3de-4b97-9d4f-04192f6f56e7)

After entering the text the model chooses the best gaps for this text and proposes some alternatives which might be chosen instead:
![image](https://github.com/user-attachments/assets/7c988a2d-7349-47ee-9541-5b8544d35767)

The customised test can be saved. After that it is possible to print, solve or share it.
![image](https://github.com/user-attachments/assets/4c1adf0e-d53d-4362-99b0-7c3a9cc67899)

Solving the test:
![image](https://github.com/user-attachments/assets/eb14ef24-a2ed-4255-b222-d7f4da404bc8)
