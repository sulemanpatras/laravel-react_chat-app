<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Redirect,Response,File;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function allusers()
    {
        $data = User::get(); // Using all() instead of get() for simplicity
        return response()->json($data);
    }
    
    public function index(){
        return view('signup');
    }

    public function register(Request $request){
        $name = $request->input('name');
        $email = $request->input('email');
        $password = Hash::make($request->input('password'));

        DB::table('users')->insert([
            'name' => $name,
            'email' => $email,
            'password' => $password
        ]);
    }

    public function login(Request $request) {
        $email = $request->input('email');
        $password = $request->input('password');
        
        if (empty($email) || empty($password)) {
            return response()->json(['success' => false, 'message' => 'Email and password are required.'], 400);
        }
        
        // Fetch user by email
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'User not found.'], 404);
        }
        
        // Check password
        if (!Hash::check($password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Invalid password.'], 401);
        }
        
        // Generate a Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'email' => $user->email,
                'id' => $user->id,
                'name' => $user->name ?? '', // Include the name if available, otherwise an empty string
            ]
        ]);
    }
    

    public function logout(Request $request) {
    // Assuming you're using a token-based authentication method
    // You can revoke the token here or just instruct the client to delete it

    return Response::json(['success' => true, 'message' => 'Logged out successfully.']);
}

    
    
    
}
