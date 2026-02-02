import pandas as pd
from sklearn import tree


def load_data():
    x_train = pd.read_csv("sympthosium_augmented.csv")
    y_train = pd.read_csv("sympthosium_augmented.csv")

    x_train = x_train.drop("Disease", axis=1)
    y_train = y_train["Disease"]

    return x_train, y_train


def load_model():
    x_train, y_train = load_data()

    clf = tree.DecisionTreeClassifier()
    clf.fit(x_train, y_train)

    return clf


model = load_model()
