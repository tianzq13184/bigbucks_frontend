from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request, jsonify
from flask import url_for
import requests
import json

import numpy as np
import pandas as pd
from BigBucks.historical import collect_stock_data
from BigBucks.historical import get_10year_yield


from config import api_key
from config import token


from BigBucks.auth import login_required
from BigBucks.db import get_db


bp = Blueprint("member", __name__)
def get_cash_balance():
    """Get the current cash balance for the current user.
    Cash is a sqlite3.Row object, use cash[0] to get the integer.
    """
    cash = (
        get_db()
        .execute(
            "SELECT cash"
            " FROM user"
            " WHERE id = ?",
            (g.user["id"],)
        )
        .fetchone()
    )
    return cash[0]

def get_name(symbol):
    name = (
        get_db()
        .execute(
            "SELECT name"
            " FROM stock s"
            " WHERE s.symbol = ?",
            (symbol,),
        )
        .fetchone()
    )
    return name[0]
    
def get_share_balance(symbol):
    """Get the # of shares held for a ticker specified in a trade for the current user."""
    shares_bought = (
        get_db()
        .execute(
            "SELECT SUM(s.share)"
            " FROM stock s JOIN user u ON u.id=s.user_id"
            " WHERE s.act = ? and s.symbol = ? and u.id = ?",
            ("buy",symbol, g.user["id"],),
        )
        .fetchone()
    )

    shares_sold  = (
        get_db()
        .execute(
            "SELECT SUM(s.share)"
            " FROM stock s JOIN user u ON u.id=s.user_id"
            " WHERE s.act = ? and s.symbol = ? and u.id = ?",
            ("sell",symbol, g.user["id"],),
        )
        .fetchone()
    )   

    if shares_bought[0] == None:
        shares_buy = 0
    else:
        shares_buy = shares_bought[0]
    
    if shares_sold[0] == None:
        shares_sell = 0
    else:
        shares_sell = shares_sold[0]
    
    holding_shares = shares_buy - shares_sell
    return holding_shares


def get_current_price(symbol):
    url = "https://api.iex.cloud/v1/data/CORE/QUOTE/"+symbol+"?token="+token

    r = requests.get(url)
    data = json.loads(r.text)
    current_price = data[0]["latestPrice"]
    #print(current_price)
    current_price = float(current_price)
    
    return current_price


# define a new function to get the company's name corresponding to a stock
def get_stock_name(symbol):
    url = "https://www.alphavantage.co/query?function=OVERVIEW&symbol="+symbol+"&interval=5min&apikey="+api_key
    response = requests.get(url)
    data = response.json()
    return data["Name"]


@bp.route("/trade", methods=("GET", "POST"))
@login_required
def trade():
    """Create a new trade for the current user."""
    if request.method == "POST":
        symbol = request.form["symbol"]
        symbol = symbol.upper()
        # date = request.form["date"]
        act = request.form["act"]
        shares = request.form["shares"]
        
        error = None

        if not symbol:
            error = "Stock symbol is required for the trade."
        if not act:
            error = "Action is required for the trade."
        if not shares:
            error = "Number of shares is required for the trade."

        try:
            shares = int(shares)
        except:
            error = "Number of shares should be an integer."
            flash(error)
            return render_template("member/trade.html")

        if shares <= 0:
            error = "Number of shares should be positive."
            flash(error)
            return render_template("member/trade.html")

        if shares%100 != 0:
            error = "Number of shares should be a multiple of 100."
            flash(error)
            return render_template("member/trade.html")

        try:
            cprice = get_current_price(symbol)
        except:
            error = "Invalid symbol or api_key!"
            flash(error)
            return render_template("member/trade.html")
        
        try:
            name = get_stock_name(symbol)
        except:
            error = "Invalid symbol or api_key!"
            flash(error)
            return render_template("member/trade.html")
        

        cash = get_cash_balance()
       
        # get the current number of shares held for a specified stock ticker
        holding_shares = get_share_balance(symbol)

        #error = None
        

        if act=="buy":
            buy = True
            if cash >= shares * cprice:
                cash -= shares * cprice
                collect_stock_data(symbol)
                # stock = BigBucks.classes.Stock(symbol)
                collect_stock_data("SPY")
            else:
                error = "Not enough cash to excute the trade!"

        if act=="sell":
            buy=False
            try:
                if holding_shares >= shares:
                    cash += shares * cprice
                    holding_shares -= shares
                else:
                    error = "Not enough shares held to be sold!"
            except:
                error = "You don't hold any " + symbol +" stock!"

        if act!="buy" and act!="sell":
            error = "Action must be either \"buy\" or \"sell\"."
        
        if error is not None:
            flash(error)
        else:
            db = get_db()
            db.execute(
                "INSERT INTO stock (symbol, name, buy, act, share, actprice, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (symbol, name, buy, act, shares, cprice, g.user["id"]),
            )
            db.execute(
                "UPDATE user SET cash = ? where id = ?",
                (cash,g.user["id"]),
            )
            db.commit()
            flash('Success!')
            return redirect(url_for("member.trade"))
            #return render_template("member/profile.html")

    db = get_db()
    trades = db.execute(
        "SELECT *"
        " FROM stock s JOIN user u ON u.id = s.user_id"
        " WHERE s.user_id = ?"
        " ORDER BY added DESC",
        (g.user["id"],)
    ).fetchall()

    return render_template("member/trade.html", trades = trades)

