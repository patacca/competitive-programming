#include <string>
#include <ios>
#include <iostream>
#include <vector>
#include <tuple>
#include <unordered_set>
#include <algorithm>
//~ #include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {true};

void debug() { if constexpr(DEBUG) cerr << endl;}

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}



// USER CODE

struct Test {
	public:
		int n;
		vector<pair<int,int>> graphNormal;
		vector<pair<int,int>> graphInverted;
};

istream& operator>>(istream& s, Test& t) {
	string str;
	s >> t.n >> str;
	
	bool hasLeftEdge {false};
	bool hasRightEdge {false};
	int k {0};
	for (auto c=str.begin(); c != str.end(); ++c) {
		pair<int,int> p1 {-1,-1};
		pair<int,int> p2 {-1,-1};
		if (hasLeftEdge)
			p1.first = k-1;
		if (hasRightEdge)
			p2.first = k-1;
		
		hasLeftEdge = false;
		hasRightEdge = false;
		if (*c == 'L') {
			hasLeftEdge = true;
			p2.second = k+1;
		} else {
			hasRightEdge = true;
			p1.second = k+1;
		}
		t.graphNormal.push_back(move(p1));
		t.graphInverted.push_back(move(p2));
		++k;
	}
	if (hasLeftEdge)
		t.graphNormal.push_back({k-1,-1});
	else
		t.graphNormal.push_back({-1,-1});
	if (hasRightEdge)
		t.graphInverted.push_back({k-1,-1});
	else
		t.graphInverted.push_back({-1,-1});
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	s << t.n;
	
	return s;
};

// Globals
int T;
vector<Test> tests;


void readInput()
{
	cin >> T;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		tests.push_back(move(t));
	}
}

void backFillLeft(Test& t, vector<pair<int,int>>& normal, vector<pair<int,int>>& inverse, int nodeIdx, vector<pair<int,int>>& normalGraph, vector<pair<int,int>>& invertedGraph)
{
	auto& node = normal[nodeIdx];
	
	if (node.first == -1) {
		if (normalGraph[nodeIdx].first == -1)
			node.first = 1;
		else {
			backFillLeft(t, inverse, normal, normalGraph[nodeIdx].first, invertedGraph, normalGraph);
			// node->left = 1 + left_node_inverted->left
			node.first = 1 + inverse[normalGraph[nodeIdx].first].first;
		}
	}
}

void backFillRight(Test& t, vector<pair<int,int>>& normal, vector<pair<int,int>>& inverse, int nodeIdx, vector<pair<int,int>>& normalGraph, vector<pair<int,int>>& invertedGraph)
{
	auto& node = normal[nodeIdx];
	
	if (node.second == -1) {
		if (normalGraph[nodeIdx].second == -1)
			node.second = 1;
		else {
			backFillRight(t, inverse, normal, normalGraph[nodeIdx].second, invertedGraph, normalGraph);
			// node->left = 1 + left_node_inverted->left
			node.second = 1 + inverse[normalGraph[nodeIdx].second].second;
		}
	}
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		vector<pair<int, int>> normal;
		vector<pair<int, int>> inverse;
		
		for (int k=0; k < t.n+1; ++k) {
			normal.push_back({-1,-1});
			inverse.push_back({-1,-1});
		}
		
		for (int k=0; k < t.n+1; ++k) {
			auto& node = normal[k];
			
			// Left
			if (node.first == -1) {
				backFillLeft(t, normal, inverse, k, t.graphNormal, t.graphInverted);
			}
			// Right
			if (node.second == -1) {
				backFillRight(t, normal, inverse, k, t.graphNormal, t.graphInverted);
			}
			
			cout << node.first + node.second - 1 << " ";
		}
		cout << endl;
	}
	
	return 0;
}
