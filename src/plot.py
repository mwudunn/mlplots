import plotly as py
from plotly.graph_objs import Surface, Scatter3d, Layout
from sklearn import datasets, linear_model, preprocessing
import numpy as np
import csv


# py.offline.plot({
#     "data": [Scatter(x=[1, 2, 3, 4], y=[4, 3, 2, 1])],
#     "layout": Layout(title="hello world")
# })

x_data = []
y_data = []
z_data = []

with open('Archive/train_PCA.csv') as csvfile:
	readCSV = csv.reader(csvfile, delimiter=',')
	for row in readCSV:
		if row[0] == 'x':
			continue
		x_data.append(float(row[0]))
		y_data.append(float(row[1]))
		z_data.append(float(row[2]))

        
x_eq = float('1.55937729e-05')
y_eq = float('-2.27575413e-05')
z_eq = float('-1.45547286e-06')
intercept = float('-0.421052631579')

x = np.linspace(min(x_data), max(x_data), 100)
y = np.linspace(min(y_data), max(y_data), 100)
X,Y = np.meshgrid(x,y)


Z = (intercept - x_eq*X - y_eq*Y) / z_eq

print(Z)
surface = Surface(x=X, y=Y, z=Z)



z1 = [
    [intercept / z_eq, (intercept - x_eq) / z_eq],
    [(intercept - y_eq) / z_eq, (intercept - x_eq - y_eq) / z_eq]
]

print(z1)

trace2 = Scatter3d(
    x=x_data,
    y=y_data,
    z=z_data,
    mode='markers',
    marker=dict(
        color='rgb(127, 127, 127)',
        size=12,
        symbol='circle',
        line=dict(
            color='rgb(204, 204, 204)',
            width=1
        ),
        opacity=0.9
    )
)


py.offline.plot([
    surface,
    trace2])
