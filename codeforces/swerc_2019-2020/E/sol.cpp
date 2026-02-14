#include <bits/stdc++.h>

using namespace std;


int main() {
	int K, L;
	cin >> K >> L;
	
	bool inverted = K < L;
	
	// Read the input matrix (HxW) with H >= W
	vector<vector<char>> input(max(K,L), vector<char>(min(K,L)));
	
	for (int k=0; k < K; ++k) {
		for (int j=0; j < L; ++j) {
			char s;
			cin >> s;
			if (K < L)
				input[j][k] = (s == 'W' ? 0 : 1);
			else
				input[k][j] = (s == 'W' ? 0 : 1);
		}
	}
	if (K < L)
		swap(K, L);
	
	// Print out the matrix
	//~ for (int k=0; k < K; ++k) {
		//~ for (int j=0; j < L; ++j) {
			//~ cout << '\0'+input[k][j] << " ";
		//~ }
		//~ cout << endl;
	//~ }
	
	// 317 ~ sqrt(1e5)
	// The 318th bit represent the constant factor
	vector<vector<bitset<318>>> mat(K, vector<bitset<318>>(L));
	for (int j=0; j < L; ++j)
		mat[0][j][j] = 1;
	
	// Get the system of equations. Every mat[k][j] is a linear combination of mat[0][j]
	for (int k=1; k < K; ++k) {
		for (int j=0; j < L; ++j) {
			mat[k][j] = mat[k-1][j];
			mat[k][j][317] = mat[k][j][317] ^ input[k-1][j];
			if (j > 0)
				mat[k][j] ^= mat[k-1][j-1];
			if (j+1 < L)
				mat[k][j] ^= mat[k-1][j+1];
			if (k > 1)
				mat[k][j] ^= mat[k-2][j];
		}
	}
	
	// We want only the last row
	vector<bitset<318>> S(L);
	for (int j=0; j < L; ++j) {
		S[j] = mat[K-1][j];
		if (j > 0)
			S[j] ^= mat[K-1][j-1];
		if (j+1 < L)
			S[j] ^= mat[K-1][j+1];
		if (K > 1)
			S[j] ^= mat[K-2][j];
	}
	
	//~ for (int j=0; j < L; ++j)
		//~ cout << S[j] << " = " << input[K-1][j] << endl;
	
	// Solve the system of equations
	
	// Triangular form
	int already = 0;
	for (int k=0; k < L; ++k) {
		// Find the first non zero bit
		int candidate = already;
		while (candidate < L && S[candidate][k] == 0) ++candidate;
		
		// Something bad might be happening
		if (candidate == L)
			continue;
		
		// Find all the rows that have the kth bit set
		for (int j=candidate+1; j < L; ++j) {
			if (S[j][k] == 1) {
				// Subtract the candidate row to the jth row
				S[j] ^= S[candidate];
				input[K-1][j] ^= input[K-1][candidate];
			}
		}
		
		// Put our candidate at the top
		swap(S[candidate], S[already]);
		swap(input[K-1][candidate], input[K-1][already]);
		++already;
	}
	
	// Solve it
	vector<vector<char>> res(K, vector<char>(L));
	for (int j=L-1; j >= 0; --j) {
		int z = j;
		while (z < L && !S[j][z]) ++z;
		
		// All zeros
		if (z == L) {
			if (S[j][317] != input[K-1][j]) {
				cout << "IMPOSSIBLE\n";
				return 0;
			}
			continue;
		}
		
		res[0][z] = S[j][317];
		for (int k=L-1; k > z; --k)
			res[0][z] ^= (S[j][k] & res[0][k]);
		res[0][z] ^= input[K-1][j];
	}
	for (int k=1; k < K; ++k) {
		for (int j=0; j < L; ++j) {
			res[k][j] = mat[k][j][317];
			for (int z=0; z < L; ++z)
				res[k][j] ^= (mat[k][j][z] & res[0][z]);
			res[k][j] = (res[k][j] == 0 ? 'A' : 'P');
		}
	}
	for (int j=0; j < L; ++j)
		res[0][j] = (res[0][j] == 0 ? 'A' : 'P');
	
	// Print out the answer
	if (inverted) {
		for (int j=0; j < L; ++j) {
			for (int k=0; k < K; ++k)
				cout << res[k][j] << " ";
			cout << endl;
		}
	} else {
		for (int k=0; k < K; ++k) {
			for (int j=0; j < L; ++j)
				cout << res[k][j] << " ";
			cout << endl;
		}
	}
	
	return 0;
}
